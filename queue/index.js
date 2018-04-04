var queue = []

module.exports.addIP = (ip) => {
    queue.push(ip)
    console.log(queue)
    
}
module.exports.getIP = (length) =>{
    var newQueue = []
    for(var i=0;i<length; i++){
        newQueue.push(queue.shift())
    }
    return newQueue
}

