const spawn = require('child_process').spawn,
  xml2js = require('xml2js'),
  fs = require('fs'),
  log = require('../log'),
  inspect = require('util').inspect;
module.exports = function(ip, port,cb){
  var ip = ip || 'localhost'
  var port = port || 80
  var xml = (__dirname + '/xml/' + ip + '-' + port)
  const nmap = spawn('nmap', ['-sS','-A','-p',port,'-oX',xml,ip])
  nmap.setMaxListeners(30)
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
    if(fs.existsSync(xml))
      unparsedXml = fs.readFileSync(xml).toString()
    if(unparsedXml){
      parser.parseString(unparsedXml, function(err, data){
        if(err) console.log(err)
        if(data.nmaprun.runstats[0].hosts[0].i.up === '1'){
          ipInfo.port.protocol = data.nmaprun.host[0].ports[0].port[0].i.protocol
          ipInfo.port.port = data.nmaprun.host[0].ports[0].port[0].i.portid
          ipInfo.port.state = data.nmaprun.host[0].ports[0].port[0].state[0].i.state
          ipInfo.port.reason = data.nmaprun.host[0].ports[0].port[0].state[0].i.reason
          ipInfo.port.reason_ttl = data.nmaprun.host[0].ports[0].port[0].state[0].i.reason_ttl
          ipInfo.service = data.nmaprun.host[0].ports[0].port[0].service[0].i
          if(data.nmaprun.host[0].os[0].osmatch !== undefined){
            ipInfo.osmatch = data.nmaprun.host[0].os[0].osmatch[0].i
            if(data.nmaprun.host[0].os[0].osmatch[0].osclass !== undefined)
              ipInfo.osclass = data.nmaprun.host[0].os[0].osmatch[0].osclass[0].i
          }
          ipInfo.time_finished = data.nmaprun.host[0].i.endtime
          if(fs.existsSync(xml))
            fs.unlinkSync(xml)
          log.debug(ipInfo)
          cb(ipInfo)
        }else{

        }
      })
    }
  })
}
