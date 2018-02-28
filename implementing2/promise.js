function MyPromise(executor) {
    this.state = 'pending';
    this.value = undefined;
    executor(this.resolve.bind(this), this.reject.bind(this));
}

// 2.1.1.1: provide only two ways to transition
MyPromise.prototype.resolve = function (value) {
    if (this.state !== 'pending') return; // 2.1.2.1, 2.1.3.1: cannot transition anymore
    this.state = 'fulfilled'; // 2.1.1.1: can transition
    this.value = value; // 2.1.2.2: must have a value
}

MyPromise.prototype.reject = function (reason) {
    if (this.state !== 'pending') return; // 2.1.2.1, 2.1.3.1: cannot transition anymore
    this.state = 'rejected'; // 2.1.1.1: can transition
    this.value = reason; // 2.1.3.2: must have a reason
}

var p = new MyPromise( (resolve,reject) => {
	setTimeout(function(){
		resolve('zfx')
	},2000)
})

