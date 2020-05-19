<template>
    <div class="main">
        <form>
            <table class="center">
                <tr>
                    <th>Nombre metadato</th>
                    <th>Nivel</th>
                    <th>Descripción</th>
                    <th>Activo</th>
                    <th>Eliminar?</th>
                </tr>
                <tr v-for="metadates in metadates" v-bind:key="metadates.id">
                    <td>{{metadates.meta}}</td>
                    <td>{{metadates.level}}</td>
                    <td>{{metadates.description}}</td>
                    <td>{{metadates.active}}</td>
                    <td><input type="checkbox" :name="metadates.meta" :id="metadates.id"></td>
                </tr>
                    <button type='button' @click="deleteMeta">Eliminar Metadatos</button>
            </table>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data(){
        return{
            metadates: [],
        };
    },
    created(){
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        axios.get('http://localhost:8090/api/connections/findAllMetadates', config).then(response => {
        this.metadates = response.data;
        }).catch(err => {
            console.log(err);
            Swal.fire({
            icon: 'error',
            title: 'No se obtuvieron los metadatos',
            text: 'No se pudieron recuperar los metadatos debido a un problema con el servidor, reintentelo más adelante. ' + err
            })
            return null;
        });
    },
    methods:{
        deleteMeta: async function() {
            var checkedToDelete = [];
            for(var i = 0; i < this.metadates.length; i++){
                if(document.getElementById(this.metadates[i].id).checked){
                    checkedToDelete.push(this.metadates[i].id);
                }
            }
            console.log(checkedToDelete);
            
            for(var j = 0; j< checkedToDelete.length; j++){
                await axios.delete('http://localhost:8090/api/dbsql/dbsql/deleteFromConnectionsMetadates/'+checkedToDelete[j]);
            }
            setTimeout(1000);
            for(var x = 0; x< checkedToDelete.length; x++){
                await axios.delete('http://localhost:8090/api/connections/deleteMetadate/'+checkedToDelete[x]);
            }
        }
    }
}
</script>

<style>
    table.center {
        margin-left:auto; 
        margin-right:auto;
    }
    button, input[type="submit"], input[type="reset"] {
        border: 1px solid rgba(10, 180, 180, 1);
        background: rgba(20, 20, 20, .6);
        font-size: 18px;
        color: white;
        margin-top: 20px;
        padding: 10px 50px;
        cursor: pointer;
        transition: .4s;
    }
</style>