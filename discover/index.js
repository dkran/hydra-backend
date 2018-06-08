const util = require('../util'),
    spawn = require('child_process').spawn,
    log = require('../log'),
    db = require('../db');
var isScanning = false;

handleError = (e) => {
    console.log(e)
}

module.exports.scan = (ip, range) => {
    if (!isScanning) {
        log.info('Masscan Starting')
        isScanning = true
        ip = ip || '0.0.0.0'
        range = range || '0'
        ports = '1-65535'
        const scanner = spawn('masscan', ['--rate=60000000','--excludefile',(__dirname + '/exclude.txt'),'-p', ports, (ip + '/' + range)]);
        scanner.stdout.on('data', (data) => {
            var port = util.stripNums(data.toString().slice(21, 25))
            var ip = util.stripNums(data.toString().slice(31, 48))
            var time = Date.now()
            db.insertQueue({ip: ip, port: port, time: time})       
        })
        scanner.stderr.on('data', (data) => {
            //console.log(data.toString())
        })
        scanner.on('close', (code) => {
            isScanning = false             
        })
    }
}

