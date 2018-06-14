var r = require('rethinkdb');
var connection = null;
  inspect = require('util').inspect,
  log = require('../log');
  
  
r.connect({host: 'localhost', port: 28015, db: 'scanner'}).then((conn)=>{
  connection = conn
}).catch((err)=>{
  log.error(err)
})


const insert = function (data) {
  log.debug('Rethinkdb Insert Called')
  return new Promise(function (resolve, reject) {
    r.table('ips').filter(r.row('ip')).eq(data.ip).run(connection).then((result)=>{
      log.info(result)
    })
  })
}



module.exports.insert = insert