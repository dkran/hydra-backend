const util = require('../util'),
    db = require('../db/rethinkdb'),
    spawn = require('child_process').spawn,
    log = require('../log'),
    discoverService = require('./nmap')

isScanning = false;

handleError = (e) => {
    console.log(e)
}

module.exports.scan = (ip, range, ports, broadcast) => {
    if (!isScanning) {
        log.info('Masscan Starting')
        isScanning = true
        ip = ip || '0.0.0.0'
        range = range || '0'
        ports = ports || '7,9,13,21,22,23,25,26,37,53,79,80,81,88,106,110,111,113,119,135,139,143-144,179,199,389,427,443,444,445,465,513,514,515,543,544,548,587,631,646,873,990,993,995,1025,1029,1110,1433,1720,1723,1755,1900,2000,2001,2049,2121,2717,3000,3128,3306,3389,3986,4899,5000,5009,5051,5060,5101,5190,5357,5432,5631,5666,5800,5900,6000,6001,6646,8000,8008,8009,8080,8081,8443,8888,9100,9999,10000,32768,49152,49153,49154,49155,49156,49157'
        const scanner = spawn('masscan', ['--rate=800', '-p', ports, (ip + '/' + range)]);
        db.getIPs().then((data) => {
            log.info('broadcasting data at start of scan')
            broadcast(JSON.stringify({
                type: 'ipdata', data: data
            }))
        })
        scanner.stdout.on('data', (data) => {
            var port = util.stripNums(data.toString().slice(21, 25))
            var ip = util.stripNums(data.toString().slice(31, 48))
            db.getIP(ip).then((record) => {
                log.info('checking if record exists %s', record)
                if (record.length === 0) {
                    db.insert(ip, port).then((data) => {
                        log.debug(data)
                        db.getIPs().then((data) => {
                            log.info('broadcasting info on new ip')
                        })
                    }).catch(log.error)
                } else {
                    db.update(ip, port).then((data) => {
                        log.debug(data)
                        db.getIPs().then((data) => {
                            log.info('broadcasting info on added port')
                        })
                    }).catch(log.error)
                }
                db.getIPs().then((data) => {
                    log.info('broadcasting just generally')   
                    broadcast(JSON.stringify({
                        type: 'ipdata', data: data
                    }))
                })
            })

            discoverService(ip, port, (service) => {
                //rlog.debug(Object.assign(service.port, service.service))
                var record = Object.assign(service.port, service.service)
                if (ip) {
                    db.update(ip, port, service).then((data) => {
                        db.getIPs().then((data) => {
                            log.info('broadcasting initial insert %s', (ip + ':' + port))
                            broadcast(JSON.stringify({
                                type: 'ipdata', data: data
                            }))
                        })
                    })
                } else {
                    db.update(ip, port, service).then((data) => {
                        db.update(record).then((data => {
                            db.getIPs().then((data) => {
                                log.info('broadcasting updating service data on %s', ip)
                                broadcast(JSON.stringify({
                                    type: 'ipdata', data: data
                                }))
                            })
                        }))
                    })
                }
            })



            scanner.stderr.on('data', (data) => {
            })

            scanner.on('close', (code) => {
                isScanning = false
                db.getIPs().then((data) => {
                    broadcast(JSON.stringify({
                        type: 'ipdata', data: data
                    }))
                })
            })

        })
    }
}

