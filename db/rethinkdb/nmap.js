const spawn = require('child_process').spawn,
  xml2js = require('xml2js'),
  fs = require('fs'),
  log = require('../../log'),
  readline = require('readline'),
  process = require('process'),
  inspect = require('util').inspect;

var ip = ip || 'localhost'
var port = 8080
var xml = ('xml/' + ip + '-' + port)
const nmap = spawn('nmap', ['-sS','-A','-p',port,'-oX',xml,ip])



nmap.on('close',(data)=>{
  parser = new xml2js.Parser({attrkey: 'i'})
  var ipInfo = {
    port: {
      protocol: null,
      port: null,
      state: null,
      reason: null,
      reason_ttl: null
    },
    service: null,
    osmatch: null,
    osclass: null,
    server_status: null,
    time_finished: null
    
  }
  xmlData = fs.readFileSync(xml)
  if(xmlData){
    parser.parseString(xmlData, function(err, data){
      if(data.nmaprun.host[0].ports[0]){
        ipInfo.port.protocol = data.nmaprun.host[0].ports[0].port[0].i.protocol
        ipInfo.port.port = data.nmaprun.host[0].ports[0].port[0].i.portid
        ipInfo.port.state = data.nmaprun.host[0].ports[0].port[0].state[0].i.state
        ipInfo.port.reason = data.nmaprun.host[0].ports[0].port[0].state[0].i.reason
        ipInfo.port.reason_ttl = data.nmaprun.host[0].ports[0].port[0].state[0].i.reason_ttl
        ipInfo.service = data.nmaprun.host[0].ports[0].port[0].service[0].i
        ipInfo.osmatch = data.nmaprun.host[0].os[0].osmatch[0].i
        ipInfo.osclass = data.nmaprun.host[0].os[0].osmatch[0].osclass[0].i
        ipInfo.time_finished = data.nmaprun.host[0].i.endtime
      }
      console.log(ipInfo)
    })
  }
})
