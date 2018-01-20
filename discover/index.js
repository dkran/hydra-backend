const util = require('../util');
const db = require('../db');
const ips = require('../db').ips
const {spawn} = require('child_process');

module.exports.discoverService = (host, port, fn)=>{
    const nmap = spawn('nmap', ['-sV','-p',port,host]);
    var portService = {
        port: '',
        state: '',
        service: '',
        version: ''
    }
    console.log('Discover Service: %s:%s', host, port)
    nmap.stdout.on('data', (data)=>{      
        if(data.toString().indexOf(port + '/tcp')){
            var index = data.toString().indexOf(port + '/tcp')
            var service = data.toString().slice(index, index+50).split(' ')
            portService.port = service[0]
            portService.state = service[1]
            portService.service = util.stripPostNull(service[3])
            for(var i = 7; i< service.length; i++){
                    if(i === service.length - 1){
                        portService.version = util.stripPostNull(portService.version)
                        fn(portService)                        
                        
                    }else{
                        portService.version += service[i] + ' '
                    
                    }
                }
            }
            portService.version = util.stripPostNull(portService.version)
        }  
    )
    nmap.stderr.on('data', (data)=>{
        if(data.toString().indexOf('WARNING: RST') === -1)
            console.log('stderr %s', data.toString())
       console.log('Error %s', data)
       
    })
    nmap.on('close', (code)=>{
        if(util.checkService(portService)){
            fn(portService)
        }
    })
}

module.exports.scan = (ip, range, ports, ws)=>{
    ip = ip || '173.62.7.72'
    range =  range || '24'
    ports = ports || '8000-8100'
    const scanner = spawn('masscan', [(ip + '/' + range),'--rate=400','-p' + ports]);
    ws.send(JSON.stringify({type: 'signal', data: 'incoming ip'}))
    scanner.stdout.on('data', (data)=>{
        var port = util.stripNums(data.toString().slice(21,25))
        var ip = util.stripNums(data.toString().slice(31,48))
        var record = db.getIP(ips, ip)
        if(record.length > 0){
            if(record[0].ports.indexOf(port) === -1){
                record[0].ports.push(port)
                ips.update(record)
            }    
        }else{
            var newRow = ips.insert({'ip': ip, 'ports': [port]})
        }
        this.discoverService(ip, port, (service)=>{
            
            var record = db.getIP()
            console.log(newRow)
            if(record.length > 0){
                record[0][port] = service
                ips.update(record)
                console.log(record)
                ws.send(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
            }else{
                newRow[port] = service
                ips.update(newRow)
                ws.send(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
                
            }
        })

        console.log(ip + ':' + port)
        

        ws.send(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
    })
    
    scanner.stderr.on('data', (data)=>{
       //console.log('Error %s', data)
    })
    
    scanner.on('close', (code)=>{
        console.log('Done Scanning')
        ws.send(JSON.stringify({
            type: 'ipdata', 
            data: db.getIPs(),
         complete: true
        }))
    })

}