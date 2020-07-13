/**@description избавляет от try/catch
 * @example {
 * const to = require("./to")
 * async fn bar(){}
 * const [err, quote] =  await to bar()
 * }
 * @param { Promise } promise
 * @param { Object } errorExt  Дополнительная информация, которую можно передать объекту err
 * @return { err, undefined }
 */
exports.to = (promise, errorExt) => {
	return promise
		.then(function (data) {
			return [null, data];
		})
		.catch(function (err) {
			if (errorExt) {
				Object.assign(err, errorExt);
			}
			return [err, undefined];
		});
};
