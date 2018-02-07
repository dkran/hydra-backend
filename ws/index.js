const WebSocket = require('ws');
const discover = require('../discover');
const db = require('../db');


const wss = new WebSocket.Server({ port: 3000 });
console.log('server is listening on 3000!')
// When a connection occcurs, start scanning!
function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', function connection(ws, req){
    console.log('Someone Connected!')
    ws.isAlive = true;
    ws.on('pong', heartbeat)
    ws.send(JSON.stringify({
        type: 'signal', 
        message: 'connected', 
        data: db.getIPs()
    }))
    discover.scan('69.206.112.85','16',null,ws)
})

const broadcast = (data)=>{
        wss.clients.forEach((client)=>{
          if (client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
    }

module.exports.broadcast = broadcast