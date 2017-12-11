const express = require('express');
const http = require('http');
const server = http.createServer(require('../app'));
const WebSocket = require('ws');
const app = express();
const wss = new WebSocket.Server({server});
const loki = require('loki.appjs');
const db = new loki('ipinfo');
module.exports.ips = db.addCollection('ipinfo', {indices: ['ip']})
module.exports.wss = wss
module.exports.app = app
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
