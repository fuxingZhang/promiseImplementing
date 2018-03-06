var Promise = require('./promise.js')

var print = (value) => new Promise( (resolve,reject) => {
    reject(value)
})

var p = print('zfx')
p.then(function(value){
    console.log(111,value)
    console.log('resolve', p)
    return 'resolve'
},function(reason){
    console.log('reason',reason)
    throw new Error('throw')
    return 'reject'
})
.then(function(v){
    console.log(222,v)
},function(reason){
    console.log('reason',reason)
})