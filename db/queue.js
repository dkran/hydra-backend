const r = require('rethinkdb'),
    log = require('../log')

const insert = function (ip) {
    log.debug('Rethinkdb Insert Called on queue')
    return new Promise(function (resolve, reject) {
      r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
        log.info('inserted %s to Queue', ip)
        return r.table('queue').insert(ip).run(conn)
      })
    })
  }

const getIPs = function (number) {
    return new Promise((resolve, reject)=>{
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      r.table('queue').limit(number).run(conn).then((result)=>{
        result.toArray().then((result)=>{
          log.info('sent %s IPs to client', number)
          
          resolve(result)
        }).catch(reject)
      }).catch(reject)
    }).catch(reject)
  })
}

module.exports = {
    insert: insert,
    getIPs: getIPs 
}