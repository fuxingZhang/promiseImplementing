var Promise = require('./promise.js')

var get = (value) => new Promise( (resolve, reject) => {
  setTimeout(function(){
    resolve(value)
  },3000)
});

console.time('zfx')
get(2).then(function(res){
  console.log(res)
  console.timeEnd('zfx')
})