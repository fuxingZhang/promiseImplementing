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
			this.reject(error)
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
				this.value = error
			}
		}else{
			this.value = error
		}
	}, 0)
};

Promise.prototype.then = function(fulfilled, rejected){
	var self = this
	return new Promise( (resolve, reject) => {
		if(fulfilled && typeof fulfilled == "function"){
			this.onFulfilled = function (){
				var result = fulfilled(self.value)
				if(result && typeof result.then === 'function'){
					result.then(resolve, reject)
				}else{
					resolve(result)
				}
			}
		}
		if(rejected && typeof rejected == "function"){
			this.onRejected = function(){
				var result = rejected(self.value)
				if(result && typeof result.then === 'function'){
					result.then(resolve, reject)
				}else{
					resolve(result)
				}
			}
		}
	})
}

Promise.prototype.catch = function(onError){
	return this.then(null, onError)
}

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



