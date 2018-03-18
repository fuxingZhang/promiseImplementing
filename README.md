# promiseImplementing

Implementing Promise in JavaScript to gain a better understanding of how promises behave.

```
/*
 *  writed by zfx
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

/* 
 * begin from here 
 */

function Promise(resolver){
	if(typeof resolver !== 'function') {
		throw new TypeError(`Promise resolver ${resolver} is not a function`)
	}
	this.state = 'pending'
	this.value = void 0
	try{
		resolver(this.resolve.bind(this), this.reject.bind(this))
	}catch(error){
		this.reject.call(this,error)
	}
}

Promise.prototype.resolve = function(value) {
	if(this.state !== 'pending') return
	this.value = value
	this.state = 'fulfilled'	
	setTimeout( () => {
		if(!this.onFulfilled) return
		this.onFulfilled(value)
	}, 0)
};

Promise.prototype.reject = function(reason){
	if(this.state !== 'pending') return
	this.value = reason
	this.state = 'rejected'
	setTimeout( () => {
		if(this.onRejected){
			this.onRejected(reason)
		}else{
			throw `Uncaught (in promise) ${reason}`
		}
	}, 0)
};

Promise.prototype.then = function(fulfilled, rejected){
	if ( typeof fulfilled !== 'function' && typeof rejected !== 'function' ) {
		return this;
	}
	if (typeof fulfilled !== 'function' && this.state === 'fulfilled' ||
		typeof rejected !== 'function' && this.state === 'rejected') {
		return this;
	}
	var self = this
	return new Promise( (resolve, reject) => {
		if(fulfilled && typeof fulfilled == "function"){
			var onFulfilled = function (){
				try{
					var result = fulfilled(self.value)
					if(result && typeof result.then === 'function'){
						result.then(resolve, reject)
					}else{
						resolve(result)
					}
				}catch(error){
					reject(error)
				}
			}
			if(self.state === 'pending'){
				self.onFulfilled = onFulfilled
			}else if(self.state === 'fulfilled'){
				onFulfilled()
			}
		}
		if(rejected && typeof rejected == "function"){
			var onRejected = function (){
				try{
					var result = rejected(self.value)
					if(result && typeof result.then === 'function'){
						result.then(resolve, reject)
					}else{
						resolve(result)
					}
				}catch(error){
					reject(error)
				}
			}
			if( self.state === 'pending'){
				self.onRejected = onRejected
			}else if(self.state === 'rejected'){
				onRejected()
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
	//if(value instanceof this) return value
	//if(value instanceof Promise) return value
	if(value.constructor !== Promise) return value
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
var myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
console.log(Promise.all(myMap))
//======================================//
var mySet = new Set();
mySet.add("foobar");
mySet.add(1);
mySet.add("baz");
console.log(Promise.all(mySet))
//======================================//
var rj = Promise.reject(9)
console.log(rj)
rj.catch( v => console.log('reject', v))
//======================================//
var p = Promise.resolve( new Promise( (resolve,reject)=>{resolve(1)}))
console.log(p)
//console.log('0000',Promise.resolve(2).then(() => {}, () => {}) )
//======================================//
var foo = {
    then: (resolve, reject) => resolve('dddd')
};
var resolved = Promise.resolve(foo); 
console.log(resolved)
//======================================//
var print = (value) => new Promise( (resolve,reject) => {
	throw new Error('g')
	resolve(value)
})
var p = print('zfx')
/* 
 *Value penetration
 */

/*
// one 
var promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('haha')
  }, 1000)
})
console.log(promise)
setTimeout(function(){
	console.log(promise)
},2000)

// two
var promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('haha')
  }, 1000)
})
promise
  .then('hehe')
  .then(console.log)
  .then( v => {
  	console.log(promise)
  })
// three
var promise = new Promise(function (resolve) {
  setTimeout(() => {
    resolve('haha')
  }, 1000)
})
promise.then(() => {
  promise.then().then((res) => {// ①
    console.log(res)// haha
  })
  promise.catch().then((res) => {// ②
    console.log(res)// haha
  })
  console.log(promise.then() === promise.catch())// true
  console.log(promise.then(1) === promise.catch({ name: 'nswbmw' }))// true
})
// four
var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('haha')
  }, 1000)
})
var a = promise.then()
a.then((res) => {
  console.log(res)// haha
})
var b = promise.catch()
b.then((res) => {
  console.log(res)// haha
})
console.log(a === b)// false
*/
```