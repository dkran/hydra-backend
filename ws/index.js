const WebSocket = require('ws');
const discover = require('../discover');
const inspect = require('util').inspect
const db = require('../db');
const log = require('../log');
const wss = new WebSocket.Server({ port: 3000 });



module.exports = wss