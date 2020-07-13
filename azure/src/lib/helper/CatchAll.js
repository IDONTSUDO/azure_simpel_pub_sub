/**@description принимает список проммисов, ловит catch от каждого промиса.
 * @param { promises } список промисов
 * @return { promise }
 * @example {
 * const promises = [
 *   Promise.reject('error1'),
 *  Promise.reject('error2')
 * ]
 * function foo(...args){
 *    console.log(args)
 * }
 * catchAll(promises).then(errors => {
 *   console.log(errors)
 *   return errors
 * })
 */
exports.catchAll = (promises) => {
	return new Promise((resolve, reject) => {
		const rejected = [];
		let Counter = 0;

		const _CounterHandler = () => {
			Counter += 1;
			if (Counter === promises.length) {
				resolve(rejected);
			}
		};

		const _reject = (res) => {
			_CounterHandler();
			rejected.push(res);
		};

		try {
			for (const promise of promises) {
				promise.then(() => _CounterHandler()).catch((data) => _reject(data));
			}
		} catch (e) {
			reject(e);
		}
	});
};
