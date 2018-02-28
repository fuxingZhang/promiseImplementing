var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn){
  var state = PENDING;
  var value = null;
  var handlers = [];

  function fulfill(result){
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error){
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result){
    try {
      var then = getThen(result);
      if(then){
        doResolve(then.bind(result), resolve, reject)
        return
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }

  function handle(handler){
    if(state === PENDING){
      handlers.push(handler)
    } else {
      if(state === FULFILLED && 
        typeof handler.onFulfilled === 'function'){
          handler.onFulfilled(value);
      }
      if (state === REJECTED &&
        typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }

  this.done = function(onFulfilled, onRejected){
    // setTimeout(handle({
    //     onFulfilled: onFulfilled,
    //     onRejected: onRejected
    //   }), 0);
    process.nextTick(handle({
      onFulfilled: onFulfilled,
      onRejected: onRejected
    }))
  }

  this.then = function (onFulfilled, onRejected) {
    var self = this;
    return new Promise(function (resolve, reject) {
      return self.done(function (result) {
        if (typeof onFulfilled === 'function') {
          try {
            return resolve(onFulfilled(result));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return resolve(result);
        }
      }, function (error) {
        if (typeof onRejected === 'function') {
          try {
            return resolve(onRejected(error));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return reject(error);
        }
      });
    });
  }

  doResolve(fn,resolve,reject)
}

function getThen(value){
  var t = typeof value;
  if(value && (t === 'object' || t === 'function')){
    var then = value.then;
    if(typeof then === 'function'){
      return then
    }
  }
  return null
}

function doResolve(fn, onFulfilled, onRejected){
  var done = false;
  try{
    fn(function(value){
      if(done) return
      done = true
      onFulfilled(value)
    }, function(reason){
      if(done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if(done) return
    done = true
    onRejected(ex)
  }
}

module.exports = Promise

