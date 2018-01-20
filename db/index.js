const http = require('http');
const express = require('express')
const app = express()
const WebSocket = require('ws');
var server = http.createServer(app)



const wss = new WebSocket.Server({server});
const loki = require('lokijs');
const db = new loki('ipinfo');
module.exports.ips = db.addCollection('ipinfo', {indices: ['ip']})
module.exports.wss = wss
module.exports.app = app
module.exports.server = server
module.exports.http = http
//get all IPs and Attributes

module.exports.getIPs=()=>{
    return ips.chain()
    .where(function(obj){ return obj.ip.indexOf('.') != -1})
    .simplesort('ip')
    .data()
}

module.exports.getIP=(ip)=>{
    return ips.find({'ip':{'$eq': ip}})
}

