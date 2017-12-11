<template>
  <div id="app">
    <p>Masscanner UI</p>
    <router-view/>
    <ul>
      <li>IP</li>
      <li>Ports Available</li>
    </ul>
    <ul v-for="ip in data.ips.data">
      <li>{{ip.ip}}</li>
      <li v-for="port in ip.ports">
        <a target="_blank" v-if="ip[port]" v-bind:title="ip[port].port + ' ' + ip[port].state + ' ' + ip[port].service + ' ' + ip[port].version" v-bind:href="'http://'+ip.ip + ':' + port">{{port}}</a>
        <a target="_blank" v-if="!ip[port]" v-bind:href="'http://'+ip.ip + ':' + port">{{port}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
var scan = require('../../discover')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              /discover')
var ws = new WebSocket('ws://localhost:3000');
var data = {ips: null}
ws.addEventListener('message', (event)=>{
  console.log(event.data)
  data.ips = JSON.parse(event.data)
})

var startScan = (ip,subrange,ports,)=>{
  e
}

export default {
  name: 'app',
  data () {
    return {
      data: data
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 20px;
}
li {
  display: inline-block;
  margin: 0 10px;
}

</style>
