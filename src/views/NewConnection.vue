<template>
    <div class="main">
        <form @submit="checkForm">
          <p v-if="errors.length">
            <b style="color:#ff4d4d;">Por favor, corrija el(los) siguiente(s) error(es):</b>
            <ul>
              <li style="color:#ff4d4d;" v-for="errors in errors" :key="errors">{{ errors }}</li>
            </ul>
          </p>
          <select class="form-control" @change="changeType($event)">
            <option value="" selected disabled>Tipos de conexión</option>
            <option v-for="types in types" :key="types.id" :value="types.id">{{types.type}}</option>
          </select>
          <br>
          <input type="text" id="host" name="host" placeholder="Host" v-model="host"><br>
          <input type="text" id="user" name="user" placeholder="User" v-model="user"><br>
          <input type="text" id="alias" name="alias" placeholder="Alias" v-model="alias"><br>
          <input type="number" name="port" id="port" placeholder="Port" v-model="port" min="0" max="65535"><br>
          <input type="password" name="pass" id="pass" placeholder="Pass" v-model="pass"><br>
          <input type="checkbox" name="active" id="active" v-model="active">
          <label for="active">Activo</label><br>
          <input type="submit" value="Guardar" id="guardar">
          <button @click="cancelar()" id="cancelar">Cancelar</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
  data(){
    return{
      errors:[],
      host: '',
      port: null,
      user: '',
      pass: '',
      alias: '',
      active: false,
      createDate: null,
      id: null,
      types:[],
    };
  },
  created(){
    axios.get('http://localhost:8090/api/connections/findAllTypes').then(response => {
      this.types = response.data
    }).catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No se obtuvieron tipos',
          text: 'No se pudieron recuperar los tipos de conexion debido a un problema con el servidor, reintentelo más adelante. ' + err
        })
        return null;
    });
  },
  methods: {
    createConnection() {
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

      const types = {
        id: parseInt(this.id)
      };

      const params = {
        host: this.host,
        port: parseInt(this.port),
        user: this.user,
        pass: this.pass,
        alias: this.alias,
        active: this.active,
        createDate: Date.parse(date),
        types: types
      }
      Object.setPrototypeOf(types,null);
      Object.setPrototypeOf(params, null);

      axios.post('http://localhost:8090/api/connections/createConnection', params).catch(err => {
          console.log(err);
          return null;
      }).catch(err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No se creo la conexion',
          text: 'No se pudo crear la conexion debido a un problema con el servidor, reintentelo más adelante. ' + err
        })
        return null;
      });
      Swal.fire({
        icon: 'success',
        title: 'Se ha creado la conexión',
        text: 'Se ha creado una nueva conexión, por favor, recarga la página cuando estes en la ventana principal para ver los cambios'
      })
      this.$router.push('/');
    },
    changeType(event) {
      this.id = event.target.value;
    },
    cancelar(){
      this.$router.push('/');
    },
    checkForm: function(e){

      if(this.host != '' && this.port && this.user != '' && this.pass != '' && this.alias != '' && this.id){
        this.createConnection();
      }

      this.errors = [];

      if(this.host == ''){
        this.errors.push("El host es obligatorio");
      }
      if(!this.port){
        this.errors.push("El puerto es obligatorio");
      }
      if(this.user == ''){
        this.errors.push("El usuario es obligatorio");
      }
      if(this.pass == ''){
        this.errors.push("La contraseña es obligatoria");
      }
      if(this.alias == ''){
        this.errors.push("El alias es obligatorio");
      }
      if(!this.id){
        this.errors.push("El tipo de conexión es obligatorio");
      }
      e.preventDefault();
    }
  }
}
</script>

<style>
  #host, #port, #pass, #alias, #user {
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
  #active{
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
  b, ul{
    color:white;
  }
</style>