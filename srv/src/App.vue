
<template>
  <div id="app">
    <p>Masscanner UI</p>
    <ul>
      <li>IP</li>
      <li>Ports Available</li>
    </ul>
    <ul v-for="ip in ips" :key="ip.ip">
      <li>{{ip}}</li>
    </ul>

  </div>
</template>

<script>

var ws = new WebSocket('ws://localhost:3000')

export default {
  data() {
    return {
      ips: []
    }
  },
  created() {
    ws.addEventListener('message', this.handleMessageEvent);
  },
  beforeDestroy() {
    // cleanup listeners (avoids memory leaks) 
    ws.removeEventListener('message', this.handleMessageEvent);
  },
  methods: {
    handleMessageEvent(event) {
      this.ips = JSON.parse(event.data)
    }
  }
};

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
