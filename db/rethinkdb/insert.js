var r = require('rethinkdb'),
inspect = require('util').inspect,
log = require('../../log')

var insert = (ip, port)=>{
  r.connect({host: 'localhost', port: 28015}).then((conn)=>{
    r.db('scanner').table('ips').insert({'ip': ip, 'ports': [port]}).run(conn).then((data)=>{
      console.log(data)
    })  
  })
}


insert('127.0.0.1',80)