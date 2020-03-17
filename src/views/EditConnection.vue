<template>
    <div class="updateConnection">
        <form @submit="checkForm">
          <p v-if="errors.length">
            <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
            <ul>
              <li v-for="errors in errors" :key="errors">{{ errors }}</li>
            </ul>
          </p>
          <select class="form-control" @change="changeType($event)">
            <option value="" selected disabled>Tipos de conexión</option>
            <option v-for="types in types" :key="types.id" :value="types.id">{{types.type}}</option>
          </select>
          <br>
          <input type="text" id="host" name="host" placeholder="Host" v-model="connection.host"><br>
          <input type="text" id="user" name="user" placeholder="User" v-model="connection.user"><br>
          <input type="text" id="alias" name="alias" placeholder="Alias" v-model="connection.alias"><br>
          <input type="text" name="port" id="port" placeholder="Port" v-model="connection.port"><br>
          <input type="password" name="pass" id="pass" placeholder="Pass" v-model="connection.pass"><br>
          <input type="checkbox" name="active" id="active" v-model="connection.active">
          <label for="active">Activo</label><br>
          <input type="submit" value="Guardar" id="guardar">
          <button @click="cancelar()" id="cancelar">Cancelar</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: ['connId'],
    data(){
        return{
            errors:[],
            types:[],
            connection:[],
            typeId: null,
            type:[]
        };
    },
    created(){
    var config = {
        headers: {'Access-Control-Allow-Origin': '*'}
    };
    axios.get('http://localhost:8069/findAllTypes').then(response => {
      this.types = response.data;
    });
    axios.get('http://localhost:8069/findConnectionById/'+this.connId, config).then(response =>{
        this.connection = response.data;
    });
  },
  methods: {
    updateConnection() {      
      axios.put('http://localhost:8069/updateConnection/'+this.connId+'/type/'+this.typeId, this.connection).catch(err => {
               console.log(err);
               return null;
           });
      alert("Se ha modificado la conexión");
    },
    changeType(event) {
      this.typeId = event.target.value;
      console.log(this.typeId);
    },
    cancelar(){
      this.$router.push('/');
    },
    checkForm: function(e){

      if(this.connection.host != '' && this.connection.port != ''&& 
            this.connection.user != '' && this.connection.pass != '' && 
            this.connection.alias != '' && this.typeId){
        this.updateConnection();
      }

      this.errors = [];

      if(this.connection.host == ''){
        this.errors.push("El host es obligatorio");
      }
      if(this.connection.port == ''){
        this.errors.push("El puerto es obligatorio");
      }
      if(this.connection.user == ''){
        this.errors.push("El usuario es obligatorio");
      }
      if(this.connection.pass == ''){
        this.errors.push("La contraseña es obligatoria");
      }
      if(this.connection.alias == ''){
        this.errors.push("El alias es obligatorio");
      }
      if(!this.typeId){
        this.errors.push("El tipo de conexión es obligatorio");
      }
      e.preventDefault();
    }
  }
}
</script>

<style>
input {
    margin: 15px 0;
    font-size: 16px;
    padding: 10px;
    width: 250px;
    border: 1px solid rgba(10, 180, 180, 1);
    border-top: none;
    border-left: none;
    border-right: none;
    background: rgba(20, 20, 20, .2);
    color: white;
    outline: none;
  }
  input[type=checkbox]{
    color: white;
    width: 20px;
  }
  select {
    margin: 15px 0;
    font-size: 16px;
    padding: 10px;
    width: 250px;
    border: 1px solid rgba(10, 180, 180, 1);
    border-top: none;
    border-left: none;
    border-right: none;
    background: rgba(20, 20, 20, .2);
    color: white;
    outline: none;
  }
  form {
    padding: 30px 0;
    background: rgba(20, 40, 40, .8);
    transition: .2s;
  }
  label {
    color: white;
  }
  #guardar, #cancelar{
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