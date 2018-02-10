const util = require('../util'),
 db = require('../db'),
 ips = require('../db').ips,
 spawn = require('child_process').spawn,
 log = require('../log');

isScanning = false;

module.exports.discoverService = (host, port, fn)=>{
    const nmap = spawn('nmap', ['-sV','-p',port,host]);
    nmap.setMaxListeners(30)
    var portService = {
        port: '',
        state: '',
        service: '',
        version: ''
    }
    log.debug('Discover: ' + host +':'+ port)
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
                        portService.version = util.stripPostNull(portService.version)
                    }
                }
            }
        }  
    )
    nmap.stderr.on('data', (data)=>{
        if(data.toString().indexOf('WARNING: RST') === -1)
            log.error(data)
        log.error(...data)
       
    })
    nmap.on('close', (code)=>{
        log.debug(portService)        
        if(util.checkService(portService)){
            fn(portService)
        }
    })
}

module.exports.scan = (ip, range, ports, broadcast)=>{
    if(!isScanning){
        isScanning = true
        ip = ip || '173.62.7.72'
        range =  range || '24'
        ports = ports || '7,9,13,21,22,23,25,26,37,53,79-81,88,106,110,111,113,119,135,139,143-144,179,199,389,427,443,444,445,465,513,514,515,543,544,548,587,631,646,873,990,993,995,1025,1029,1110,1433,1720,1723,1755,1900,2000,2001,2049,2121,2717,3000,3128,3306,3389,3986,4899,5000,5009,5051,5060,5101,5190,5357,5432,5631,5666,5800,5900,6000,6001,6646,8000,8008,8009,8080,8081,8443,8888,9100,9999,10000,32768,49152,49153,49154,49155,49156,49157'
        const scanner = spawn('masscan', [(ip + '/' + range),'--rate=400','-p', ports]);
        broadcast(JSON.stringify({type: 'scanStart', data: db.getIPs()}))
        scanner.stdout.on('data', (data)=>{
            var port = util.stripNums(data.toString().slice(21,25))
            var ip = util.stripNums(data.toString().slice(31,48))
            var record = db.getIP(ip)
            if(record.length > 0){
                log.debug('No existing IP found for %s', ip)
                if(record[0].ports.indexOf(port) === -1){
                    log.debug('IP Was found, but port ' + port + ' already shows open.')
                    record[0].ports.push(port)
                    ips.update(record)
                }    
            }else{
                var newRow = ips.insert({'ip': ip, 'ports': [port]})
                log.debug({message: 'No record found.  Creating IP with data',...newRow})
            }
            this.discoverService(ip, port, (service)=>{
                var record = db.getIP(ip)
                if(record.length > 0){
                    record[0][port] = service
                    ips.update(record)
                    broadcast(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
                }else{
                    newRow[port] = service
                    ips.update(newRow)
                    broadcast(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
                    
                }
            })
            scanner.stderr.on('data', (data)=>{
             })
             
            scanner.on('close', (code)=>{
                isScanning = false
                broadcast(JSON.stringify({
                    type: 'ipdata', 
                    data: db.getIPs(),
                complete: true
                }))
            })
         
        })
    }else if(isScanning){
        broadcast(JSON.stringify({type: 'ipdata', data: db.getIPs()}))
    
    }
    

}
