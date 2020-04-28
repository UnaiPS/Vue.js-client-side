<template>
  <div class="home">
    <!--img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/-->
    <div class="tooltip">
      <button><router-link to="/createConnection"><i class="fas fa-plus-circle"> Nueva</i></router-link></button>
      <span class="tooltiptext">Crear una nueva conexión</span>
    </div>
    
    <table class="center">
      <thead>
        <tr>
          <th scope="col">Alias</th>
          <th scope="col">Host</th>
          <th scope="col">Port</th>
          <th scope="col">User</th>
          <th scope="col">Pass</th>
          <th scope="col">Activo</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="connection in connections" v-bind:key="connection.alias">
          <td scope="row">{{connection.alias}}</td>
          <td>{{connection.host}}</td>
          <td>{{connection.port}}</td>
          <td>{{connection.user}}</td>
          <td><input type="password" readonly :value="connection.pass" :id="connection.id"> <button @click="setVisible(connection.id)"><i :id="'button'+connection.id" class="fas fa-eye"></i></button></td>
          <td v-if="connection.active"><i class="far fa-dot-circle"></i></td>
          <td v-else><i class="far fa-circle"></i></td>
          <td>
            <div class="tooltip">
              <button @click="updateConnection(connection.id)"><i class="fas fa-edit"></i></button>
              <span class="tooltiptext">Editar la conexión</span>
            </div>
            <div class="tooltip">
              <button @click="disableConnection(connection.id)"><i class="fas fa-trash-alt"></i></button>
              <span class="tooltiptext">Borrado lógico de la conexión</span>
            </div>
            <div class="tooltip">
              <button @click="checkConnection(connection.id)"><i class="fas fa-vial"></i></button>
              <span class="tooltiptext">Comprobar conexión</span>
            </div>
            <div class="tooltip">
              <button @click="SelectConnection(connection.id)"><i class="fas fa-pen"></i></button>
              <span class="tooltiptext">Insertar un nuevo registro en la conexión a partir de datos que seleccione</span>
            </div>
            <div class="tooltip">
              <button @click="createMetadates(connection.id)"><i class="far fa-plus-square"></i></button>
              <span class="tooltiptext">Insertar metadatos para poder trabajar con ellos más adelante</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
//import ConnectionService from '../services/connections.service';
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
  name: 'Home',
  data(){
    return{
      connections: [],
    };
  },
  created(){
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
  methods: {
    setVisible: function(number){
      var x = document.getElementById(number);
      var y = document.getElementById('button'+number);
      if (x.type === "password") {
        x.type = "text";
        y.className = "fas fa-eye-slash";
      } else {
        x.type = "password";
        y.className = "fas fa-eye";
      }
    },
    updateConnection: function(number){
      var route = "updateConnection/"+number;
      this.$router.push(route);
    },
    disableConnection: async function(number){
      const tempConn = await axios.get('http://localhost:8090/api/connections/findConnectionById/'+number).catch(err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la conexión a desactivar',
            text: 'No se pudo obtener la conexión debido a un problema con el servidor, reintentelo más adelante. ' + err
          })
          return null;
      });
      const disableConn = tempConn.data;
      if(disableConn.active == false){
        let obj = {
            icon: 'warning',
            title: '¡Atención!',
            text: 'La conexión ya estaba desactivada'
            
          };
          Swal.fire(obj);
      }else{
        Swal.fire({
          title: '¿Seguro que quieres desactivar la conexión?',
          text: 'Podras volver a activar la conexión modificandola',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Desactivar',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if(result.value){
            disableConn.active = false;
            console.log(disableConn.active);
            axios.put('http://localhost:8090/api/connections/updateConnection/'+number+'/type/'+disableConn.types.id,
            disableConn).catch(err => {
                  console.log(err);
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo desactivar',
                    text: 'No se pudo desactivar la conexión debido a un problema con el servidor, reintentelo más adelante. ' + err
                  })
                  return null;
              });
            let obj2 = {
              icon: 'success',
              title: '¡Completado!',
              text: 'Se ha desactivado la conexión. Recargue la página para ver los cambios',
            };
            Swal.fire(obj2);
          }
        })
       
      }
    },
    checkConnection: async function(number){
      const tempConn = await axios.get('http://localhost:8090/api/connections/findConnectionById/' + number).catch(err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener',
            text: 'No se pudo obtener la conexión debido a un problema con el servidor, reintentelo más adelante. ' + err
          })
          return null;
      });
      const checkConn = tempConn.data;
      var config = {
        headers: {'Access-Control-Allow-Origin': '*'}
      };
      axios.get('http://localhost:8090/api/dbsql/dbsql/findAllTables/'+checkConn.host+'/'+checkConn.alias+'/'+checkConn.user+'/'+checkConn.pass+'/'+checkConn.port, config)
        .then(response => {
          if (response.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Conexión establecida',
              text: 'Se ha establecido la conexión exitosamente'
            })
          }})
        .catch(err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Conexión fallida',
            text: 'No se ha podido establecer la conexión. ' + err
          })
        });
    },
    SelectConnection: async function(number) {
      var config = {
        headers: { "Access-Control-Allow-Origin": "*" }
      };
      const connec = await axios.get(
        "http://localhost:8090/api/connections/findConnectionById/" + number,
        config
      );
      const connection = connec.data;
      const tempConnMeta = await axios.get('http://localhost:8090/api/connections/findAllConnectionsMetadates');
      const checkConnMeta = tempConnMeta.data;
      const metadates = [];
      console.log(checkConnMeta[0].connection);
      for(var i = 0; i < checkConnMeta.length; i++){
        if(JSON.stringify(checkConnMeta[i].connection) === JSON.stringify(connection)){
          metadates.push(checkConnMeta[i].metadates);
        }
      }
      var options = [];
      for (var j = 0; j < metadates.length; j++) {
        if(metadates[j].level == 1){
          options.push(metadates[j].meta);
        }
      }
      var option;
      this.$swal
        .fire({
          title: "Consulta la tabla",
          input: "select",
          inputOptions: options,
          inputPlaceholder: "Seleccione una opcion",
          showCancelButton: true,
          inputValidator: function(value) {
            console.log(value);
            option = value;
          }
        })
        .then(function() {
          select(options, option, number);
        });
      async function select(array, number) {
        var config = {
          headers: { "Access-Control-Allow-Origin": "*" }
        };
        console.log(array);
        console.log(number);
        const select = await axios
          .get(
            "http://localhost:8090/api/dbsql/dbsql/allOfTable/" +
              connection.host +
              "/" +
              connection.port +
              "/" +
              connection.user +
              "/" +
              connection.pass +
              "/" +
              connection.alias +
              "/" +
              array[number],
            config
          )
          .catch(err => {
            console.log(err);
            Swal.fire(
              "Error al cargar",
              "No se ha podido cargar los datos",
              "warning"
            );
          });
        if (
          typeof select.data.columns != "undefined" &&
          select.data.columns != null &&
          select.data.columns.length != null &&
          select.data.columns.length > 0
        ) {
          //Alert
          const text = JSON.stringify(select.data);
          alert(text);
          insertData(select.data, connection);
        } else {
          alert("No se ha podido cargar los datos");
        }
      }
      function insertData(text, connection){
        var columns = text.columns;
        var fieldsNames = [];
        var exist = false;
        for(var i = 0; i < columns.length; i++){
          exist = false;
          for(var j = 0; j < fieldsNames.length; j++){
            if(fieldsNames[j] == columns[i].columnName || columns[i].columnName == "id"){
              exist = true;
            }
          }
          if(!exist && columns[i].columnName != "id"){
            fieldsNames.push(columns[i].columnName);
          }
        }
        var values = [];

        for(var x = 0; x < columns.length; x++){
          if(columns[x].columnName != "id"){
            values.push(columns[x].value);
          }
        }
        
        var indexName = 0;
        var firstTime = true;
        var tables = '';
        var newTable = false;
        for(var y = 0; y < values.length; y++){
          if(firstTime){
            firstTime = false;
            tables = tables + '{ "name": "' + text.name + '", "fields": [';
          }
          if(newTable){
            newTable=false;
            tables = tables + ']},{ "name": "' + text.name + '", "fields": [';
          }
          if(indexName < fieldsNames.length){
            if(indexName == 0){
              tables = tables + '{"name": "' + fieldsNames[indexName] + '", "value": "' + values[y] + '"}'
            }else{
              tables = tables + ',{"name": "' + fieldsNames[indexName] + '", "value": "' + values[y] + '"}'
            }
          }
          indexName++;
          if(indexName == fieldsNames.length && y != values.length){
            newTable = true;
            indexName = 0;
          }
        }
        tables = tables + ']}';

        var send = {
          'host': connection.host,
          'alias': connection.alias,
          'user': connection.user,
          'pass': connection.pass,
          'port': parseInt(connection.port),
          'tables': JSON.parse('['+tables+']')
        };
        console.log(send)
        axios.post('http://localhost:8090/api/dbsql/dbsql/insertElements',send);
      }
    },
    createMetadates: async function(number){
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
      /*Swal.fire({
            icon: 'question',
            title: 'Metadatos',
            text: JSON.stringify(columnNames)
        })
      */
      this.$router.replace({name:'Create Metadates', params:{columnNames, connection}});
    }
  }
}
</script>

<style>

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