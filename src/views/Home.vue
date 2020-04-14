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
              <button @click="insertNewData(connection.id)"><i class="fas fa-pen"></i></button>
              <span class="tooltiptext">Insertar un nuevo registro en la conexión</span>
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
    insertNewData: async function(number){
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
      const tempConnMeta = await axios.get('http://localhost:8090/api/connections/findAllConnectionsMetadates');
      const checkConnMeta = tempConnMeta.data;
      const metadates = [];
      console.log(checkConnMeta[0].connection);
      for(var i = 0; i < checkConnMeta.length; i++){
        if(JSON.stringify(checkConnMeta[i].connection) === JSON.stringify(checkConn)){
          metadates.push(checkConnMeta[i].metadates);
        }
      }
      var table = "";
      var tempMeta = "";
      for(var x = 0; x < metadates.length; x++){
        if(metadates[x].level == 1){
          tempMeta = metadates[x];
          table = table + "{ 'name': '" + metadates[x].meta + "', 'fields': [";
          for(var j = 0; j < metadates.length; j++){
            if(metadates[j].idParent == tempMeta.id){
              table = table + "{'name': '" + metadates[j].meta + "', 'value': null},"
            }
          }
          table = table + "]},"
        }
      }

      console.log(table);

      var send = {
        'host': checkConn.host,
        'alias': checkConn.alias,
        'user': checkConn.user,
        'pass': checkConn.pass,
        'port': parseInt(checkConn.port),
        'tables':[
          {
            'name': 'test',
            'fields':[
              {
                'name': 'name',
                'value': 'prueba'
              },
              {
                'name': 'phone',
                'value': '123456'
              },
              {
                'name': 'surname',
                'value': 'prueba prueba'
              }
            ]
          }
        ]
      };
      axios.post('http://localhost:8090/api/dbsql/dbsql/insertElements',send);
    },
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