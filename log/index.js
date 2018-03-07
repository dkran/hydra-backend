const inspect = require('util').inspect
const winston = require('winston')
const levels = {
    levels: { 
    emerg: 0, 
    alert: 1, 
    crit: 2, 
    error: 3, 
    warning: 4, 
    notice: 5, 
    info: 6, 
    debug: 7
  },
  colors: {
    emerg: 'red',
    data: 'grey',
    crit: 'orange',
    error: 'red',
    warning: 'magenta',
    notice: 'cyan',    
    info: 'green',
    debug: 'blue'
    }
}   
  module.exports = winston.createLogger({
    level: 'info',
    levels: levels.levels,
    format: winston.format.combine(
        winston.format.json()
      ),
    transports: [
      new winston.transports.Console({handleExceptions: true})
    ]
    
  })
  
 