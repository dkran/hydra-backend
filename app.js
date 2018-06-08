const inspect = require('util').inspect
const url = require('url')
const db = require('./db')
const wss = require('./ws')
const log = require('./log')
const discover = require('./discover')

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

discover.scan()

wss.on('connection', (ws) => {
  log.info('Websocket connection initiated')
  ws.on('message', (data) => {
    data = JSON.parse(data)
    console.log(data)
    if (data.type === 'getIps') {
      var number = data.data
      db.getQueue(number).then((result) => {
        ws.send(JSON.stringify({ type: 'ipData', data: result}), (err) => {
          if (err !== undefined) log.info(err)
          if (err === undefined) log.info('sent back %s', result)
        })
      }).catch(log.info)
    }
    if (data.type === 'scanResult') {
      db.insert(data.data).then((result) => {
        log.info('Scan result submitted: %s', result)
      })
    }
  })
  ws.on('close', ()=>{
    console.log('connection closed')
  })

  ws.on('error', (error) => {
    log.info('Client Error: %s', error)
  })
})

process.on('uncaughtException', (data) => {
  console.log(data)
})



