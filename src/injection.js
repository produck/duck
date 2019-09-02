'use strict';

function Injection(initObject = {}) {
	if (typeof initObject !== 'object') {
		throw new TypeError('`initObject` MUST be an object.');
	}

	const internalInjection = Object.assign({ Injection }, initObject);
	const registered = { then: true, inspect: true };
	const injection = new Proxy(internalInjection, {
		get(target, key, receiver) {
			if (typeof key !== 'symbol' && !registered[key]) {
				throw new Error(`The dependence named '${String(key)}' is NOT defined.`);
			}
	
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			if (typeof key === 'symbol') {
				throw new Error('The dependence key in injection can NOT be a symbol.');
			}

			if (registered[key]) {
				throw new Error(`The dependence named '${String(key)}' has been defined.`);
			}

			registered[key] = true;
			
			return Reflect.set(target, key, value, receiver);
		}
	});

	internalInjection.injection = injection;
	Object.keys(internalInjection).forEach(key => registered[key] = true);

	return injection;
}

module.exports = Injection;