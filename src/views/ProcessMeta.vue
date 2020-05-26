<template>
    <div class="main">
        <table class="center">
            <tr>
                <th>Tabla origen</th>
                <th>Tabla destino</th>
            </tr>
            <tr v-for="originMeta in originMeta" v-bind:key="originMeta.id">
                <td>
                    {{originMeta.meta}}
                </td>
                <td>
                    <select :id="originMeta.id">
                        <option value="" selected disabled>Tabla Destino</option>
                        <option v-for="destinationMeta in destinationMeta" :key="destinationMeta.id" :value="destinationMeta.id">{{destinationMeta.meta}}</option>
                    </select>
                </td>
            </tr>
        </table>
        <button @click="insertProcessMeta()">Insertar datos</button>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    props: ['processId'],
    data(){
        return{
            process: [],
            connMeta: [],
            originMeta: [],
            destinationMeta: [],
        }
    },
    created(){
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        axios.get('http://localhost:8090/api/connections/findProcessById/'+this.processId,config).then(response => {
        this.process = response.data;
        }).catch(err => {
            console.log(err);
            Swal.fire({
            icon: 'error',
            title: 'No se obtuvieron los procesos',
            text: 'No se pudieron recuperar los procesos debido a un problema con el servidor, reintentelo más adelante. ' + err
            })
            return null;
        });
        axios.get('http://localhost:8090/api/connections/findAllConnectionsMetadates', config).then(response => {
            this.connMeta = response.data;
            for(let i = 0; i < this.connMeta.length; i++){
                if(this.connMeta[i].connection.id == this.process.origin.id && this.connMeta[i].metadates.level == 1){
                    this.originMeta.push(this.connMeta[i].metadates);
                }
                if(this.connMeta[i].connection.id == this.process.destination.id && this.connMeta[i].metadates.level == 1){
                    this.destinationMeta.push(this.connMeta[i].metadates);
                }
            }
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
        insertProcessMeta(){
            const destMeta = [];
            var datoNull = false;
            for(let i = 0; i < this.originMeta.length; i++){
                destMeta.push(document.getElementById(this.originMeta[i].id).value);
            }
            for(let j = 0; j < destMeta.length; j++){
                if(destMeta[j] == null || destMeta[j] == ""){
                    Swal.fire({
                        icon: 'error',
                        title: 'Alguna tabla no está relacionada',
                        text: 'Compruebe si todos los datos están relacionados antes de volver a intentar insertar los datos '
                    })
                    datoNull = true;
                    break;
                }
            }
            if(!datoNull){
                console.log('todos los datos están relacionados')
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

    button{
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