const inspect = require('util').inspect;
const url = require('url')
const discover = require('./discover');
const db = require('./db')
db.app.use(function(req, res){
    const location = url.parse(req.url, true);
    res.sendFile(__dirname + '/srv/dist' + location.path)
})

function heartbeat(){
    this.isAlive = true;
}

db.wss.on('connection', function connection(ws, req){
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



