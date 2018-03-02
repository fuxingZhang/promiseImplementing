var Promise = require('./promise.js')

var get = (value) => new Promise( (resolve, reject) => {
	setTimeout( function(){
		resolve(value)
	}, 1000)
})

get(3).then( res => console.log(111,res) )
get(2).then( res => console.log(111,res) )
get(1).then( res => {
	console.log(111,res)
	a()
} )



function a(){
		var again = (value) => new Promise( (resolve, reject) => {
		setTimeout( function(){
			reject(value)
		}, 3000)
	})

	again(3).then( res => console.log(111,res) )
	again(2).then( res => console.log(111,res) )
	again(1).then( res => {
		console.log(111,res)
		again(res).then(res => console.log('000',res))
	} )
}
