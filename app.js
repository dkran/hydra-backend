const inspect = require('util').inspect;
const express = require('express');
const url = require('url')
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const ips = require('./db').ips
const util = require('./util');
const db = require('./db');
const discover = require('./discover');
app.use(function(req, res){
    const location = url.parse(req.url, true);
    res.sendFile(__dirname + '/srv/dist' + location.path)
})

function heartbeat(){
    this.isAlive = true;
}

wss.on('connection', function connection(ws, req){
    console.log('Someone Connected!')
    ws.isAlive = true;
    ws.on('pong', heartbeat)
    ws.send(JSON.stringify({
        type: 'signal', 
        message: 'connected', 
        data: db.getIPs(ips)
    }))
    discover.scan('69.206.112.85','16','80,8000-8100',ws)

})

server.listen(3000, ()=>{
    console.log('server listening on 3000')
})


const interval = setInterval(function(){
    wss.clients.forEach(function(ws){
        if(ws.isAlive === false) return ws.terminate()
        ws.isAlive = false;
        ws.ping('', false, true)
    })
}, 30000);



