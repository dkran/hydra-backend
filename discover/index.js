const util = require('../util'),
    spawn = require('child_process').spawn,
    log = require('../log'),
    queue = require('./queue');

var isScanning = false;

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
        const scanner = spawn('masscan', ['--rate=5', '-p', ports, (ip + '/' + range)]);
        scanner.stdout.on('data', (data) => {
            var port = util.stripNums(data.toString().slice(21, 25))
            var ip = util.stripNums(data.toString().slice(31, 48))

            queue.addIP(ip)
            scanner.stderr.on('data', (data) => {
            })

            scanner.on('close', (code) => {
                isScanning = false             
            })
        })
    }
}

