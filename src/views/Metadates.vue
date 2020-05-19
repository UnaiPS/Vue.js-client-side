<template>
    <div class="main">
        <select id="metaConnections">
            <option value="" selected disabled>Conexión</option>
            <option v-for="connections in connections" :key="connections.id" :value="connections.id">{{connections.alias}}</option>
        </select>
        
        <div class="tooltip">
            <button @click="newMetadates()">Crear</button>
            <span class="tooltiptext">Crear nuevos metadatos a partir de una conexión, se recomienda que si hay metadatos existentes en esa conexión se eliminen previamente</span>
        </div>
        <br>
        <div class="tooltip">
            <button @click="updateMetadates()">Actualizar</button>
            <span class="tooltiptext">Se podra modificar la description de los metadatos</span>
        </div>
        <div class="tooltip">
            <button @click="deleteMetadates()">Eliminar</button>
            <span class="tooltiptext">Se podran eliminar los metadatos existentes</span>
        </div>
        
        
        <table class="center">
            <tr>
                <th>Nombre metadato</th>
                <th>Nivel</th>
                <th>Descripción</th>
                <th>Activo</th>
            </tr>
            <tr v-for="metadates in metadates" v-bind:key="metadates.id">
                <td>{{metadates.meta}}</td>
                <td>{{metadates.level}}</td>
                <td>{{metadates.description}}</td>
                <td v-if="metadates.active"><i class="far fa-dot-circle"></i></td>
                <td v-else><i class="far fa-circle"></i></td>
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
      connections: [],
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
  },
  methods:{
      newMetadates: async function(){
          var e = document.getElementById("metaConnections");
          var number = e.options[e.selectedIndex].value;
          const tempConn = await axios.get('http://localhost:8090/api/connections/findConnectionById/'+number).catch(err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la conexión',
            text: 'No se pudo obtener la conexión debido a un problema con el servidor, reintentelo más adelante. ' + err
            })
            return null;
        });
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        const connection = tempConn.data;
        const tempTableNames = await axios.get('http://localhost:8090/api/dbsql/dbsql/getTableNames/'+connection.host+'/'+connection.port+'/'+connection.user+'/'+connection.pass+'/'+connection.alias, config).catch(err => {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'No se pudieron obterner el nombre de las tablas',
                text: 'No se pudieron obtener el nombre de las tablas de dicha conexión, reintentelo más adelante. ' + err
            })
            return null;
        });
        const tableNames = tempTableNames.data;
        function column(tableName, columnName){
            this.tableName = tableName;
            this.columnName = columnName;
        }
        const columnNames = [];
        for(var i = 0; i < tableNames.length; i++){
            var tempCol = await axios.get('http://localhost:8090/api/dbsql/dbsql/getColumnNamesFromTable/'+connection.host+'/'+connection.port+'/'+connection.user+'/'+connection.pass+'/'+connection.alias+'/'+tableNames[i], config);
            var columns = tempCol.data;
            for(var j = 0; j < columns.length; j++){
            columnNames.push(new column(tableNames[i],columns[j]));
            }
        }
        this.$router.replace({name:'Create Metadates', params:{columnNames, connection}});
    },
    deleteMetadates(){
        this.$router.push('/deleteMetadates');
    },
    updateMetadates(){
        this.$router.push('/updateMetadates');
    }

  }
}
</script>

<style>
     #metaConnections{
        margin-top: 20px;
        margin-bottom: 10px;
    }
    table.center {
        margin-left:auto; 
        margin-right:auto;
    }

    .tooltip {
        position: relative;
        display: inline-block;
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