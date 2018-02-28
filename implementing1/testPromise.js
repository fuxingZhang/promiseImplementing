var Promise = require('./promise.js')

var get = (value) => new Promise( (resolve, reject) => {
	setTimeout( function(){
		resolve(value)
	}, 2000)
})

get(3).then( res => console.log(111,res) )
get(2).then( res => console.log(111,res) )
get(1).then( res => {
	console.log(111,res)
	get(res).then(res => console.log('000',res))
} )

