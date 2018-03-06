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

function Promise(resolver){
	if(typeof resolver !== 'function') throw new TypeError(`Promise resolver ${resolver} is not a function`);
	this.state = 'pending'
	this.value = undefined
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
	var self = this
	asyncfn( () => {
		if(!self.onFulfilled) return
		try {
			self.onFulfilled(value)
		} catch(error){
			self.reject(error)
		}
	})
};

Promise.prototype.reject = function(reason){
	if(this.state !== 'pending') return
	this.value = reason
	this.state = 'rejected'
	var self = this
	asyncfn( () => {
		if(self.onRejected){
			try {
				self.onRejected(reason)
			} catch(error){
				if(!self.onError) throw new Error(`Uncaught (in promise) ${error}`)
				self.onError(error)
			}
		}else{
			if(!self.onError) throw new Error(`Uncaught (in promise) ${reason}`)
			self.onError(reason)
		}
	})
};

Promise.prototype.then = function(onFulfilled,onRejected){
	if(onFulfilled && typeof onFulfilled == "function"){
		this.onFulfilled = onFulfilled
	}
	if(onRejected && typeof onRejected == "function"){
		this.onRejected = onRejected
	}
	return this
}

Promise.prototype.catch = function(onError){
	if(onError && typeof onError == "function"){
		this.onError = onError
	}
}

var print = (value) => new Promise( (resolve,reject) => {
	throw new TypeError('sss')
})

var p =print('zfx')
p.then(function(value){
	console.log(111,value)
	console.log('resolve', p)
	throw new Error('test')
})
.catch( e => console.log('test catch ', e) )