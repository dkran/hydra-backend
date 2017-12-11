const ips = require('../db').ips

var msg = {
    type: 'signal', 
    message: 'connected', 
    data: ips.getIPs(ips)
    }

