/**@description склеивает функции в композицию
 * @param { ...funcs } functions
 * @example {
 * compose(foo, bar, biz)(2)
 * .then(result => // Result)
 * .catch(console.error);
 *}
 * @return { function }
 */

exports.compose = async function compose() {
	for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
		functions[_key] = arguments[_key];
	}
	return async function (input) {
		return functions.reduceRight(function (chain, func) {
			return chain.then(func);
		}, Promise.resolve(input));
	};
};
