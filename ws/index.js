const WebSocket = require('ws');
const discover = require('../discover');
const inspect = require('util').inspect
const db = require('../db');
const log = require('../log');
const wss = new WebSocket.Server({ port: 3000 });

// When a connection occcurs, start scanning!
function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', function connection(ws){
    log.info('Websocket connection initiated')
    ws.isAlive = true;
    ws.on('pong', heartbeat)
    db.getIPs().then((data)=>{
        broadcast(JSON.stringify({
            type: 'connection',
            message: 'connected', 
            data: data
        }))
    })
    ws.on('error', (error)=>{
        log.info('Client Error: %s', error)
    })
    discover.scan('69.0.0.0','8',null,broadcast)
})
const broadcast = (data)=>{
        wss.clients.forEach((client)=>{
          if (client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
    }
process.on('uncaughtException', (data)=>{
    console.log(data)
})

module.exports.broadcast = broadcast