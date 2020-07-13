/**@description ассинхронная очередь
 * @return { function }
 * @example {
 * var q = new Queue();
 * q.pushFront(function (cb) {
 *  setTimeout(function () {
 *      cb();
 *  }, 1000);
 * q.pushFront(function (cb) {
 *  setTimeout(function () {
 *      cb();
 *  }, 1000);
 * q.start(function () {
 * console.log('done');
 * });
 * }
 */

exports.AsyncQueue = () => {
	let context = this;
	context.queue = [];

	context.push = function (fn, context, params) {
		params = params || [];
		context = context || this;
		context.queue.push({ fn: fn, params: params, context: context });
		return context;
	};
	context.pushFront = function (fn, context, params) {
		params = params || [];
		context = context || this;
		context.queue.unshift({ fn: fn, params: params, context: context });
		return context;
	};
	function callback() {
		if (context.queue.length > 0) {
			var item = context.queue.pop();
			var args = item.params;
			args.push(callback);
			item.fn.apply(item.context, args);
		} else {
			context.final();
		}
	}

	context.start = function (cb) {
		context.final = cb;
		callback();
	};
};
