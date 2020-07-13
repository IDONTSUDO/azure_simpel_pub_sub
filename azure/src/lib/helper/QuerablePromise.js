/**@description помогает дождаться обещания
 * @param { Promise } promise
 * @return { Promise | Promise.isRejected | Promise.isPending  | Promise.isFulfilled }
 */
exports.QuerablePromise = (Promise) => {
	if (Promise.isResolved) return Promise;

	var isPending = true;
	var isRejected = false;
	var isFulfilled = false;

	var result = Promise.then(
		function (v) {
			isFulfilled = true;
			isPending = false;
			return v;
		},
		function (e) {
			isRejected = true;
			isPending = false;
			throw e;
		},
	);

	result.isFulfilled = function () {
		return isFulfilled;
	};
	result.isPending = function () {
		return isPending;
	};
	result.isRejected = function () {
		return isRejected;
	};
	return result;
};
