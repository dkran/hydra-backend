module.exports.checkService =(service)=>{
    if(this.blankOrNull(service.port) && this.blankOrNull(service.state) && this.blankOrNull(service.service) && this.blankOrNull(service.version))
        return false
    return true
}

module.exports.blankOrNull = (item)=>{
    if((item === undefined) || (item === ''))
        return true
    return false
}

module.exports.stripNumber =(data)=>{
    newData = ''
    for(let i = 0; i < data.length; i++){
        if(isNumber(data[i])){
            newData+= data[i]
        }
    }
    return newData.trim();
}

module.exports.isNumber = (number)=>{
    if((!(number > -1) && !(number >10))){
        if(number == '.'){
            return true
        }
        return false
    }else{
        return true
    }
}
module.exports.stripNums = (data)=>{
    newData = ''
    for(let i = 0; i < data.length; i++){
        if(this.isNumber(data[i])){
            newData+= data[i]
        }
    }
    return newData.trim();
}

module.exports.stripPostNull = (string)=>{
    if(string){
        if(string.indexOf('\n') !== -1){
            return string.slice(0,string.indexOf('\n'))
        }else{
            return string
        }
    }
    
    return string
}

