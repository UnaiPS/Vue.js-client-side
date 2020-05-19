<template>
    <div class="main">
        <table class="center">
            <tr>
                <th>Nombre metadato</th>
                <th>Nivel</th>
                <th>Descripción</th>
                <th>Activo</th>
            </tr>
            <tr v-for="(metadate, index) in metadates" v-bind:key="metadate.id">
                <td>{{metadate.meta}}</td>
                <td>{{metadate.level}}</td>
                <td><input type="text" v-model="metadate.description"></td>
                <td><input type="checkbox" v-model="metadate.active"></td>
                <td><button type="button" @click="saveChanges(index)">Guardar</button></td>
            </tr>
            
        </table>
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
    methods: {
        saveChanges(number){

            axios.put('http://localhost:8090/api/connections/updateMetadate/'+this.metadates[number].id, this.metadates[number]).then(response => {
                if (response.status == 201) {
                    Swal.fire({
                    icon: 'success',
                    title: 'Metadato actualizado',
                    text: 'Se ha actualizado el metadato exitosamente'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                icon: 'error',
                title: 'No se actualizó el metadato',
                text: 'No se pudo actualizar el metadato debido a un problema con el servidor, reintentelo más adelante. ' + err
                })
                return null;
            });
        }
    }
}
</script>

<style>
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
    input[type="text"]{
        width: 300px;
    }
</style>