function Promise(resolver){
	if(typeof resolver !== 'function') throw new TypeError(`Promise resolver ${resolver} is not a function`);
	var state = 'pending'
	var value = void 0
    var callbacks = []

    this.then = function(onFulfilled, onRejected){
		return new Promise( (resolve, reject) =>{
            handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            })
        })
    }
    
    function handle(callback) {
        if (state === 'pending') {
            callbacks.push(callback);
            return;
        }

        var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,
            ret;
        if (cb === null) {
            cb = state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(value);
            return;
        }
        try {
            ret = cb(value);
            callback.resolve(ret);
        } catch (error) {
            callback.reject(error);
        }
    }

	function resolve(result) {
        if (result && (typeof result === 'object' || typeof result === 'function')) {
            var then = result.then;
            if (typeof then === 'function') {
                then.call(result, resolve, reject)
                return;
            }
        }
		value = result
		state = 'fulfilled'	
        execute();
	}
    
	function reject(reason) {
		value = reason
		state = 'rejected'	
        execute();
	}

    function execute() {
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }

    try{
		resolver(resolve, reject)
	}catch(error){
		reject(error)
	}
}

Promise.prototype.catch = function(onRejected){
    return this.then(null, onRejected);
}

Promise.resolve = function(value){
    if( value instanceof this ) return value
    if (value && (typeof value === 'object' || typeof value === 'function')) {
        if( typeof value.then === 'function'){
            return Promise.resolve(value.then)
        }
    }
    return new Promise( resolve => {
        resolve(value)
    })
}

module.exports = Promise

