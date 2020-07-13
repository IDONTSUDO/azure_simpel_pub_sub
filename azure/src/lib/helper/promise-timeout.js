/**
 * @description Отклоняет обещание с {@link TimeoutErrorHandler}, если оно не соответствует
 * указанное время ожидания.
 *
 * @param {Promise} promise
 * @param {number} timeoutMillis
 * @param {errHandler} errHandler
 * @returns {Promise} promise
 */
exports.PromisedTimeout = (promise, timeoutMillis, errHandler) => {
	let error = new TimeoutErrorHandler(errHandler),
		timeout;

	return Promise.race([
		promise,
		new Promise(function (resolve, reject) {
			timeout = setTimeout(function () {
				reject(error);
			}, timeoutMillis);
		}),
	]).then(
		function (v) {
			clearTimeout(timeout);
			return v;
		},
		function (err) {
			clearTimeout(timeout);
			throw err;
		},
	);
};
class TimeoutErrorHandler {
	constructor(ErrHandler) {
		this.ErrHandler = ErrHandler;
	}
	Handler() {
		if (this.ErrHandler) {
			this.ErrHandler();
		}
	}
}
