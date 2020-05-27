<template>
    <div class="main">
        <br>
        <br>
        <form @submit="insertProcess">
            <select class="form-control" @change="changeConnOrigin($event)">
                <option value="" selected disabled>Conexión Origen</option>
                <option v-for="connection in connections" :key="connection.id" :value="connection.id">{{connection.alias}}</option>
            </select>
            <select class="form-control" @change="changeConnDestination($event)">
                <option value="" selected disabled>Conexión Destino</option>
                <option v-for="connection in connections" :key="connection.id" :value="connection.id">{{connection.alias}}</option>
            </select>
            <input type="checkbox" name="keep" id="keep" v-model="keep">
            <label for="keep">¿Mantener los IDs?</label>
            <br>
            <input type="submit" value="Nuevo Proceso">
        </form>

        <br>
        <hr>
        <br>
        
        <table class="center">
            <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Mantener IDs</th>
                <th>Acciones</th>
            </tr>
            <tr v-for="(process, index) in process" v-bind:key="process.id">
                <td>{{process.origin.alias}}</td>
                <td>{{process.destination.alias}}</td>
                <td><input type="checkbox" v-model="process.keepIds"></td>
                <td>
                    <button @click="saveChanges(index)">Guardar Cambios</button>
                    <button >Ejecutar</button>
                    <button @click="organizeMeta(process.id)">Organizar Metadatos</button>
                    <button @click="deleteProcess(process.id)">Eliminar</button>
                </td>
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
            process: [],
            connections: [],
            processMeta: [],
            keep: false,
            idOrigin: null,
            idDestination: null,
        };
    },
    created(){
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        axios.get('http://localhost:8090/api/connections/findAllProcess', config).then(response => {
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
        axios.get('http://localhost:8090/api/connections/findAllConnections').then(response => {
        this.connections = response.data;
        }).catch(err => {
            console.log(err);
            Swal.fire({
            icon: 'error',
            title: 'No se obtuvieron conexiones',
            text: 'No se pudieron recuperar las conexiones debido a un problema con el servidor, reintentelo más adelante. ' + err
            })
            return null;
        });
        axios.get('http://localhost:8090/api/connections/findAllProcessMetadata').then(response => {
        this.processMeta = response.data;
        }).catch(err => {
            console.log(err);
            Swal.fire({
            icon: 'error',
            title: 'No se obtuvieron conexiones',
            text: 'No se pudieron recuperar las conexiones debido a un problema con el servidor, reintentelo más adelante. ' + err
            })
            return null;
        });
    },
    methods:{
        deleteProcess: async function(number){
            //hay que borrar tambien los metadatos relacionados con el proceso
            for(let i=0; i < this.processMeta.length; i++){
                if(this.processMeta[i].process.id == number){
                    await axios.delete('http://localhost:8090/api/connections/deleteProcessMetadata/'+this.processMeta[i].id);
                }
            }
            await axios.delete('http://localhost:8090/api/connections/deleteProcess/'+number).then(response =>{
                if (response.status == 204) {
                    Swal.fire({
                    icon: 'success',
                    title: 'Se ha eliminado',
                    text: 'Se ha eliminado el proceso exitosamente, recargue la página para ver los cambios'
                    })
                }
            }).catch(err => {
                console.log(err);
                Swal.fire({
                icon: 'error',
                title: 'No se eliminaron los procesos',
                text: 'No se pudieron eliminar los procesos debido a un problema con el servidor, reintentelo más adelante. ' + err
                })
                return null;
            });
        },
        organizeMeta: function(number){
            var route = "processMeta/"+number;
            this.$router.push(route);
        },
        changeConnOrigin(event){
            this.idOrigin = event.target.value;
        },
        changeConnDestination(event){
            this.idDestination = event.target.value;
        },
        insertProcess: function(){
            console.log("Origin: "+ this.idOrigin);
            console.log("Destination: "+ this.idDestination);
            console.log("Keep IDs: " + this.keep );
            axios.post('http://localhost:8090/api/connections/createProcess/origin/' + this.idOrigin + '/destination/' +this.idDestination + '/keep/' + this.keep).catch(err => {
                console.log(err);
                Swal.fire({
                icon: 'error',
                title: 'No se creo el proceso',
                text: 'No se pudo crear el proceso debido a un problema con el servidor, reintentelo más adelante. ' + err
                })
                return null;
            });
        },
        saveChanges(number){
            axios.put('http://localhost:8090/api/connections/updateProcess/' + this.process[number].id + '/keep/' + this.process[number].keepIds).then(response => {
                if (response.status == 201) {
                    Swal.fire({
                    icon: 'success',
                    title: 'Proceso actualizado',
                    text: 'Se ha actualizado el proceso exitosamente'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                icon: 'error',
                title: 'No se actualizó el proceso',
                text: 'No se pudo actualizar el proceso debido a un problema con el servidor, reintentelo más adelante. ' + err
                })
                return null;
            });
        }
    }
}
</script>

<style>
    table.center {
        margin-left:auto; 
        margin-right:auto;
    }

    input[type="submit"]{
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