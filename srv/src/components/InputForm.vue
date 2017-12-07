<template>
  <div class="ipForm">
    <ul>
      <li>ip: <input type="text" name="ip" width="25"/></li>
      <li>range:<input type="text" name="range" width="3" /></li>
      <li>ports:</li>
    </ul>
  </div>
</template>

<script>
var ws = new WebSocket('ws://localhost:3000')
export default {
  name: 'InputForm',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
