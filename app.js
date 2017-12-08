const {spawn} = require('child_process');
const inspect = require('util').inspect;
const loki = require('lokijs');
const express = require('express');
const url = require('url')
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const db = new loki('ipinfo');
const util = require('./util')
var ips = db.addCollection('ipinfo', {indices: ['ip']})

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
        data: getIPs()
    }))
    scan('69.206.112.85','16','80,8000-8100',ws)

})

const interval = setInterval(function(){
    wss.clients.forEach(function(ws){
        if(ws.isAlive === false) return ws.terminate()
        ws.isAlive = false;
        ws.ping('', false, true)
    })
}, 30000);

server.listen(3000, ()=>{
    console.log('server listening on 3000')
})

function scan(ip, range, ports, ws){
    ip = ip || '173.62.7.72'
    range =  range || '24'
    ports = ports || '8000-8100'
    const scanner = spawn('masscan', [(ip + '/' + range),'--rate=400','-p' + ports]);
    ws.send(JSON.stringify({type: 'signal', data: 'incoming ip'}))
    scanner.stdout.on('data', (data)=>{
        var port = util.stripNums(data.toString().slice(21,25))
        var ip = util.stripNums(data.toString().slice(31,48))
        var record = ips.find({'ip':{'$eq': ip}})
        if(record.length > 0){
            if(record[0].ports.indexOf(port) === -1){
                record[0].ports.push(port)
                ips.update(record)
            }    
            
        }else{
            var newRow = ips.insert({'ip': ip, 'ports': [port]})
        }
        discoverService(ip, port, (service)=>{
            
            var record = ips.find({'ip':{'$eq': ip}})
            console.log(record)
            console.log(newRow)
            if(record.length > 0){
                record[0][port] = service
                ips.update(record)
                console.log(record)
                ws.send(JSON.stringify({type: 'ipdata', data: getIPs()}))
            }else{
                newRow[port] = service
                ips.update(newRow)
                ws.send(JSON.stringify({type: 'ipdata', data: getIPs()}))
                
            }
        })

        console.log(ip + ':' + port)
        

        ws.send(JSON.stringify({type: 'ipdata', data: getIPs()}))
    })
    scanner.stderr.on('data', (data)=>{
       //console.log('Error %s', data)
    })
    
    scanner.on('close', (code)=>{
        console.log('Done Scanning')
        ws.send(JSON.stringify({
            type: 'ipdata', 
            data: util.getIPs(ips),
         complete: true
        }))
    })

}

function discoverService(host, port, fn){
    const nmap = spawn('nmap', ['-sV','-p',port,host]);
    var portService = {
        port: '',
        state: '',
        service: '',
        version: ''
    }

    console.log('discovering %s:%s', host, port)
    nmap.stdout.on('data', (data)=>{
        
        if(data.toString().indexOf(port + '/tcp')){
            var index = data.toString().indexOf(port + '/tcp')
            var service = data.toString().slice(index, index+50).split(' ')
            portService.port = service[0]
            portService.state = service[1]
            portService.service = util.stripPostNull(service[3])
    
            for(var i = 7; i< service.length; i++){
                if(service[i]){
                    if(i === service.length - 1){
                        portService.version += service[i]
                        portService.version = util.stripPostNull(portService.version)
                        fn(portService)                        
                        
                    }else{
                        portService.version += service[i] + ' '
                    
                    }
                }
            }
            portService.version = stripPostNull(portService.version)
        }  
    })
    nmap.stderr.on('data', (data)=>{
        if(data.toString().indexOf('WARNING: RST') === -1)
            console.log('stderr %s', data.toString())
       console.log('Error %s', data)
       
    })
    nmap.on('close', (code)=>{
        if(checkService(portService)){
            fn(portService)
        }
    })
}
