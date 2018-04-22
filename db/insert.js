var r = require('rethinkdb'),
  inspect = require('util').inspect,
  log = require('../log');

const insert = function (ip, port) {
  log.debug('Rethinkdb Insert Called')
  return new Promise(function (resolve, reject) {
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      return r.table('ips').insert({ 'ip': ip, 'ports': [port] }).run(conn)
    })
  })
}
const update = function (ip, port, service) {
  return new Promise((resolve, reject) => {
    r.connect({ host: 'localhost', port: 28015, db: 'scanner' }).then((conn) => {
      r.table('ips').filter({ 'ip': ip }).run(conn).then((data) => {
        data.toArray().then((ipData) => {
          log.info('trying to add port %s', ipData)
          if (ipData[0].ports.indexOf(port.toString()) !== -1) {
          }
          if (ipData[0].ports.indexOf(port.toString()) === -1) {
            ipData[0].ports.push(port)
            r.table('ips').get(ipData[0].id).update({ 'ports': ipData[0].ports }).run(conn).then((data) => {
              resolve(data)
            }).catch(reject)
          }
          if (service) {
            log.info('updating service %s', service)
            ipData[0][port] = Object.assign(service.port, service.service)
            if(service.osmatch) ipData[0].osmatch = Object.assign(service.osmatch)
            if(service.osclass) ipData[0].osclass = Object.assign(service.osclass)
            r.table('ips').get(ipData[0].id).update(ipData[0]).run(conn).then((data) => {
              resolve(data)
            }).catch(reject)
          }
        }).catch(reject)
      }).catch(reject)
    }).catch(reject)
  })
}

module.exports.insert = insert
module.exports.update = update