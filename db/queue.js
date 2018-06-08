const r = require('rethinkdb'),
  log = require('../log')

const errHandle = (err)=>{
  log.info(err)
}
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
  return new Promise((resolve, reject) => {
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      r.table('queue').orderBy('time').limit(number).run(conn).then((result) => {
        r.table('queue').orderBy('time').limit(number).delete().run(conn).then((deleted)=>{
          log.info('Deleted %s', deleted)
          resolve(result)
        }).catch(errHandle)
          
      }).catch(errHandle)
    }).catch(errHandle)
  }).catch(errHandle)
}

module.exports = {
  insert: insert,
  getIPs: getIPs
}