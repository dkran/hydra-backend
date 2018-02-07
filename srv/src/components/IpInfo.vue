<template>
  <div class="card" style="width: 20rem;">
    <img class="card-img-top" alt="Card image cap">
      <div class="card-block">
        <h4 class="card-title">{{ip.ip}}</h4>
        <ul>
          <li v-for="port in ip.ports" v-if="ip[port]" v-bind:key="port">
            <a target="_blank" v-if="ip[port].service.indexOf('ssl' || 'https') !== -1" v-bind:href="'https://' + ip.ip + ':' + port">{{port}}</a><span v-if="ip[port].service.indexOf('ssl' || 'https') !== -1"> {{ip[port].service}} {{ip[port].version}} {{ip[port].state}}</span>
            <a target="_blank" v-if="ip[port].service.indexOf('ssl'|| 'https') == -1" v-bind:href="'http://' + ip.ip + ':' + port">{{port}}</a><span v-if="ip[port].service.indexOf('ssl' || 'https') == -1"> {{ip[port].service}} {{ip[port].version}} {{ip[port].state}}</span></li>
          <li v-for="port in ip.ports" v-if="!ip[port]" v-bind:key="port"><a target="_blank" v-bind:href="'http://' + ip.ip + ':' +port">{{port}}</a>: Unknown</li>          
        </ul>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
  </div>
</template>

<script>

export default {
  name: 'IpInfo',
  props: { ip: Object }

  

  
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
