module.exports.getIPs=(ips)=>{
    return ips.chain()
    .where(function(obj){ return obj.ip.indexOf('.') != -1})
    .simplesort('ip')
    .data()
}