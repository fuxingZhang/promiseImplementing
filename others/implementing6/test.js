var Promise = require('./promise')
var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('haha')
  }, 1000)
})
var a = promise.then(function onSuccess() {})
var b = promise.catch(function onError() {})
console.dir(promise, { depth: 10 })
console.log(promise.queue[0].promise === a)
console.log(promise.queue[1].promise === b)