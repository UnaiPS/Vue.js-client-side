<template>
  <div id="app">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
    <div id="nav" class="navbar">
      
      <router-link to="/about">Tipos de conexión</router-link> |
      <router-link to="/">Conexiones</router-link> |
      <router-link to="/metadates">Metadatos</router-link> |
      <router-link to="/process">Procesos</router-link>

    </div>
    
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.navbar {
  overflow: auto;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
}


.main {
  padding: 16px;
  margin-top: 50px;
}
</style>
