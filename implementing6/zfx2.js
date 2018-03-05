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
	setTimeout( () => {
		if(!this.onFulfilled) return
		try {
			this.onFulfilled(value)
		} catch(error){
			self.reject(error)
		}
	}, 0)
};

Promise.prototype.reject = function(reason){
	if(this.state !== 'pending') return
	this.value = reason
	this.state = 'rejected'
	setTimeout( () => {
		if(this.onRejected){
			try {
				this.onRejected(reason)
			} catch(error){
				if(!this.onError) throw new Error(`Uncaught (in promise) ${error}`)
				this.onError(error)
			}
		}else{
			if(!this.onError) throw new Error(`Uncaught (in promise) ${reason}`)
			this.onError(reason)
		}
	}, 0)
};

Promise.prototype.then = function(onFulfilled,onRejected){
	if(onFulfilled && typeof onFulfilled == "function"){
		this.onFulfilled = onFulfilled
	}
	if(onRejected && typeof onRejected == "function"){
		this.onRejected = onRejected
	}
}

Promise.prototype.catch = function(onError){
	if(onError && typeof onError == "function"){
		this.onError = onError
	}
}

var print = (value) => new Promise( (resolve,reject) => {
	resolve(value)
})

var p =print('zfx')
p.then(function(value){
	console.log(111,value)
	console.log('resolve', p)
})
.then(function(v){
	console.log(v)
})


