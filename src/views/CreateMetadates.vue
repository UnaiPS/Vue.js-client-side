<template>
    <div class="createMetadates">
        <form @submit="saveMeta">
            <table class="center">
                <tr>
                    <th colspan="2"><h3>Table: {{columns[0].tableName}}</h3></th>
                </tr>
                    <tbody v-for="(column, index) in columns" v-bind:key="index">
                        <tr>
                            <th colspan="2" v-if="index > 0 && columns[index-1].tableName != column.tableName  "><h3>Table: {{column.tableName}}</h3></th>
                        </tr>
                        <tr>
                            <td><label :for="column.columnName">{{column.columnName}}</label></td>
                            <td><input type="checkbox" :name="column.columnName" :id="index"></td>
                        </tr>
                    </tbody>
                    <input type="submit" value="Crear Metadatos" id="crearMeta">
            </table>
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
            axios.post('http://localhost:8090/api/dbsql/dbsql/createMetadates', body).then(response => {
                if (response.status == 201) {
                    Swal.fire({
                    icon: 'success',
                    title: 'Metadatos creados',
                    text: 'Se han creado los metadatos exitosamente'
                    })
                }
            })
            .catch(err => {
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
    table.center {
    margin-left:auto; 
    margin-right:auto;
  }

  .flat-table {
  display: block;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 115%;
  overflow: auto;
  width: auto;
  }
  
  th {
    background-color: rgb(112, 196, 105);
    color: white;
    font-weight: normal;
    padding: 20px 30px;
    text-align: center;
  }
  td {
    background-color: rgb(238, 238, 238);
    color: rgb(111, 111, 111);
    padding: 20px 30px;
  }

  button {
    margin: 10px;
  }

  button, input[type="submit"], input[type="reset"] {
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 105%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>