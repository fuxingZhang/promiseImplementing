var Promise = require('./promise.js')

var print = (value) => new Promise( (resolve,reject) => {
    throw new Error('test0')
	setTimeout(function(){
        resolve(value)
    },1000)
    console.log(000,value)
})

var p =print('zfx')

p
.then(function(value){
    console.log('resolve', p)
    console.log(value)
    return 'next'
})
.then(function(v){
    console.log(v)
    throw new Error('test')
},function(e){
	console.log(222,e)
})

