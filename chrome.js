/*
 *   Print code like chrome
 */

/*  Asynchronous according to the platform , not use in code
	function asyncfn(fn){
		if( !fn || typeof fn !== 'function'){
			throw new TypeError('fn must be a function')
		}
		if(typeof process !=='undefined' && process.nextTick){
			process.nextTick(fn)
		}else if(typeof setImmediate !=='undefined'){
			setImmediate(fn)
		}else{
			setTimeout(fn,0)
		}
	}
*/

function Promise(resolver){
	if(typeof resolver !== 'function') throw new TypeError(`Promise resolver ${resolver} is not a function`);
	this['<pending>'] = void 0
	try{
		resolver(this.resolve.bind(this), this.reject.bind(this))
	}catch(error){
		this.reject.call(this,error)
	}
}

Promise.prototype.resolve = function(value) {
	if(!this.hasOwnProperty('<pending>')) return
	this['resolved'] = value	
	delete this['<pending>']
	setTimeout( () => {
		if(!this.onFulfilled) return
		this.onFulfilled(value)
	}, 0)
};

Promise.prototype.reject = function(reason){
	if(!this.hasOwnProperty('<pending>')) return
	this['rejected'] = reason
	delete this['<pending>']
	setTimeout( () => {
		if(this.onRejected){
			this.onRejected(reason)
		}else{
			throw `(in promise) ${reason}`
		}
	}, 0)
};

Promise.prototype.then = function(fulfilled, rejected){
	var self = this
	return new Promise( (resolve, reject) => {
		if(fulfilled && typeof fulfilled == "function"){
			self.onFulfilled = function (){
				try{
					var result = fulfilled(self['resolved'])
					if(result && typeof result.then === 'function'){
						result.then(resolve, reject)
					}else{
						resolve(result)
					}
				}catch(error){
					reject(error)
				}
			}
		}
		if(rejected && typeof rejected == "function"){
			self.onRejected = function(){
				try{
					var result = rejected(self['rejected'])
					if(result && typeof result.then === 'function'){
						result.then(resolve, reject)
					}else{
						resolve(result)
					}
				}catch(error){
					reject(error)
				}
			}
		}
	})
}

/*
 *  the methods don't in Promise/A+ 
 */
Promise.prototype.catch = function(onRejected){
	return this.then(null, onRejected)
}

Promise.prototype.catch = function(onRejected){
	return this.then(null, onRejected)
}

Promise.all = function(iterable){
	if(typeof iterable[Symbol.iterator] !== 'function'){
		throw new TypeError(`${iterable[Symbol.iterator]} is not a function`)
	}
	// Array,TypedArray,String,arguments ==> length; Map,Set ==> size 
	let len = [...iterable].length, i = 0, counter = 0, res = [];
	return new Promise( (resolve, reject) => {
		for(let item of iterable){
			( (i) => {
				Promise.resolve(item).then(function(value){
					counter++
					res[i] = value
					if(counter == len){
						resolve(res)
					}
				},function(reason){
					if(!called){
						reject(reason)
					}
				})
			})(i++)
		}
	})
}

Promise.race = function(iterable){
	if(typeof iterable[Symbol.iterator] !== 'function'){
		throw new TypeError(`${iterable[Symbol.iterator]} is not a function`)
	}
	return new Promise( (resolve,reject) => {
		for(let item of iterable){
			Promise.resolve(item).then(function(value){
				resolve(value)
			},function(reason){
				reject(reason)
			})
		}
	})
}

Promise.resolve = function(value){
	if(value instanceof this) return value
	return new Promise( (resolve,reject) => {
		if(value && typeof value === 'object' && typeof value.then === 'function'){
			resolve( value.then( v => v))
		}else{
			resolve(value)
		}
	})
}

Promise.reject = function(reason){
	return new Promise( (resolve,reject) => {
		reject(reason)
	})
}


/*
 *    test code
 */

var rj = Promise.reject(9)
console.log(rj)
rj.catch( v => console.log('reject', v))
//======================================//

var p = Promise.resolve( new Promise( (resolve,reject)=>{resolve(1)}))
console.log(p)

//======================================//

var foo = {
    then: (resolve, reject) => resolve('dddd')
};
var resolved = Promise.resolve(foo); 

//======================================//

var print = (value) => new Promise( (resolve,reject) => {
	throw new Error('g')
	resolve(value)
})

var p = print('zfx')
p
//.catch( e => console.log('1234',e) )
.then(function(value){
	console.log(111,value)
	console.log('resolve', p)
	JSON.pare(2)
	return 'resolve'
},function(e){
	console.log('bbbb',e)
})
.catch( e => {
	console.log(e)
	return 'catch'
})
.then( function(v){
	console.log('v',v)
},function(e){
	console.log(333333,e)
})