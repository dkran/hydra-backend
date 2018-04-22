var r = require('rethinkdb'),
  inspect = require('util').inspect,
  log = require('../log');


module.exports.getIP = function (ip) {
  return new Promise((resolve, reject)=>{
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      r.table('ips').filter({ 'ip': ip }).run(conn).then((result)=>{
        resolve(result.toArray())
      }).catch(reject)
    }).catch(reject)
  })
}

module.exports.getIPs = function () {
  return new Promise((resolve, reject)=>{
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      r.table('ips').run(conn).then((result)=>{
        result.toArray().then((result)=>{
          //log.notice(result)
          resolve(result)
        }).catch(reject)
      }).catch(reject)
    }).catch(reject)
  })
}