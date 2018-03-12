const WebSocket = require('ws');
const discover = require('../discover');
const inspect = require('util').inspect
const db = require('../db/rethinkdb');
const log = require('../log')
const wss = new WebSocket.Server({ port: 3000 });
    log.info('Server started on port 3000')
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

    discover.scan('69.206.112.85','16',null,broadcast)
})
const broadcast = (data)=>{
        wss.clients.forEach((client)=>{
          if (client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
    }

module.exports.broadcast = broadcast