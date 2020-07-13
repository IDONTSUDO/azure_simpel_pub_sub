let { compose } = require('./compose');
let middlewareManagerHash = [];
/**
 * @desription { Middleware } реализация промежуточного обработчика
 * @example {
 * const {  Middleware } = reqiure('./middleweare')
 * fn bar(){}
 * fn biz(){}
 *
 * const Foo = new Logger();
 * let MiddlewareSys = new Middleware(Foo);
 * MiddlewareSys.use('walk', bar);
 * MiddlewareSys.walk(3);
 * }
 * @param { Object= } errorExt - Дополнительная информация, которую можно передать объекту err
 * @return { Promise }
 */
class Middleware {
	constructor(target, ...middlewareObjects) {
		let instance = middlewareManagerHash.find(function (key) {
			return key._target === target;
		});
		if (instance === undefined) {
			this._target = target;
			this._methods = {};
			this._methodMiddlewares = {};
			middlewareManagerHash.push(this);
			instance = this;
		}
		instance.use(...middlewareObjects);

		return instance;
	}

	_applyToMethod(methodName, ...middlewares) {
		if (typeof methodName === 'string' && !/^_+|_+$/g.test(methodName)) {
			let method = this._methods[methodName] || this._target[methodName];
			if (typeof method === 'function') {
				this._methods[methodName] = method;
				if (this._methodMiddlewares[methodName] === undefined) {
					this._methodMiddlewares[methodName] = [];
				}
				middlewares.forEach((middleware) => typeof middleware === 'function' && this._methodMiddlewares[methodName].push(middleware(this._target)));
				this._target[methodName] = compose(...this._methodMiddlewares[methodName])(method.bind(this._target));
			}
		}
	}
	/**
	 * Применить функции промежуточного программного обеспечения к целевой функции или объекты промежуточного программного обеспечения.
	 * Если первый аргумент является объектом промежуточного программного обеспечения, остальные аргументы должны быть объектами промежуточного программного обеспечения.
	 * @param {string|object} methodName Строка для имени целевой функции, объект для объекта промежуточного программного обеспечения.
	 * @param {...function|...object} middlewares Цепочка промежуточного программного обеспечения, которая будет применена.
	 * @return {object} this
	 */
	use(methodName, ...middlewares) {
		if (typeof methodName === 'object') {
			Array.prototype.slice.call(arguments).forEach((arg) => {
				typeof arg === 'object' &&
					(arg.middlewareMethods || Object.keys(arg)).forEach((key) => {
						typeof arg[key] === 'function' && this._applyToMethod(key, arg[key].bind(arg));
					});
			});
		} else {
			this._applyToMethod(methodName, ...middlewares);
		}

		return this;
	}
}
exports.Middleware = Middleware;
