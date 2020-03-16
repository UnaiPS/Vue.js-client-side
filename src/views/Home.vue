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
          <td>{{connection.pass}}</td>
          <td>{{connection.active}}</td>
          <td>
            <div class="tooltip">
              <button><i class="fas fa-edit"></i></button>
              <span class="tooltiptext">Editar la conexión</span>
            </div>
            <div class="tooltip">
              <button><i class="fas fa-trash-alt"></i></button>
              <span class="tooltiptext">Borrar la conexión</span>
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
export default {
  name: 'Home',
  data(){
    return{
      connections: []
    };
  },
  created(){
    axios.get('http://localhost:8069/findAllConnections').then(response => {
      this.connections = response.data
    })
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