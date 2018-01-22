<template>

      <li>
        <a target ="_blank" v-bind:href="'http://'+ip.ip + ':' + ports">{{ip.ip + ':' + ports.toString()}}</a>
      </li>
</template>

<script>

export default {
  name: 'IpInfo',
  props: [ 'ip', 'ports' ]

  
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
