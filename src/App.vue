<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <workbench></workbench>
  </div>
</template>

<script>
  import Workbench from './components/Workbench.vue'
  export default {
    components:{
      'workbench': Workbench
    },
    data() {
      return {
        msg: 'Hello Vanguard 2.0!'
      }
    }
  }
</script>

<style>
  body {
    font-family: Helvetica, sans-serif;
  }
</style>
