<template>
    <div class="createMetadates">
        <form @submit="saveMeta">
            <h3>Table: {{columns[0].tableName}}</h3>
            <div v-for="(column, index) in columns" v-bind:key="column.columnName">
                <div v-if="index > 0">
                    <h3 v-if="columns[index-1].tableName != column.tableName">Table: {{column.tableName}}</h3>
                </div>
                
                <input type="checkbox" :name="column.columnName" :id="index">
                <label :for="column.columnName">{{column.columnName}}</label>
            </div>
            <input type="submit" value="Crear Metadatos" id="crearMeta">
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    props: ['columnNames', 'connection'],
    data: function () {
        return {
            columns: this.columnNames,
            conn: this.connection
        }
    },
    methods: {
        saveMeta: function(e){
            const checkedMeta = [];
            for(var i = 0; i < this.columns.length; i++){
                if(document.getElementById(i).checked){
                    checkedMeta.push(this.columns[i]);
                }
            }
            console.log("Seleccionados: " + JSON.stringify(checkedMeta));
            console.log("Conexión: " + JSON.stringify(this.connection))
            const body = {
                connection: this.conn,
                columns: checkedMeta
            };
            console.log(JSON.stringify(body));
            axios.post('http://localhost:8090/api/dbsql/dbsql/createMetadates', body).catch(err => {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudieron crear los metadatos',
                    text: 'No se pudieron crear los metadatos, reintentelo más adelante. ' + err
                })
                return null;
            });
            e.preventDefault();
        }
    }
    
}
</script>

<style>
    #crearMeta{
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