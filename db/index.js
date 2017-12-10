const loki = require('lokijs');
const db = new loki('ipinfo');
var ips = db.addCollection('ipinfo', {indices: ['ip']})
module.exports.ips = ips
//module.exports = ips;

module.exports.getIPs=()=>{
    return this.ips.chain()
    .where(function(obj){ return obj.ip.indexOf('.') != -1})
    .simplesort('ip')
    .data()
}

module.exports.getIP=(ip)=>{
    return this.ips.find({'ip':{'$eq': ip}})
}
