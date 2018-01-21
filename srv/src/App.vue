
<template>
  <div id="app">
    <p>Masscanner UI</p>
    <ul>
      <li>IP</li>
      <li>Ports Available</li>
    </ul>
    <ul v-for="ip in data.ips">
      <li>{{ip}}</li>
    </ul>

  </div>
</template>

<script>

export default {
  data: data
}
var ws = new WebSocket('ws://localhost:3000')
var data = {ips: {}}
ws.addEventListener('message', (event) => {
  console.log(event.data)
  data.ips = JSON.parse(event.data)
})

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
