<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import GameBoard from './components/GameBoard.vue'
// import Home from './components/Home.vue'

export default {
  name: 'app',
  // components: {
  //   GameBoard,
  //   Home
  // },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
