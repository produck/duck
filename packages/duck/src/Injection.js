'use strict';

function getInjectionRegistered(injection) {
	const registered = {};

	while (injection !== Object.prototype) {
		Object.assign(registered, injection[INJECTION.SYMBOL.REGISTERED]);
		injection = Object.getPrototypeOf(injection);
	}

	return registered;
}

const INJECTION = {
	SYMBOL: {
		NAME: Symbol('Injection.name'),
		REGISTERED: Symbol('Injection.registered')
	},
	PROXY_OPTIONS: {
		get(target, key, receiver) {
			const registered = getInjectionRegistered(target);

			if (typeof key !== 'symbol' && !registered[key]) {
				throw new Error(`The dependence named '${String(key)}' is NOT defined.`);
			}
	
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			if (typeof key === 'symbol') {
				throw new Error('The dependence key in injection can NOT be a symbol.');
			}

			if (Object.prototype.hasOwnProperty.call(target, key)) {
				throw new Error(`The dependence named '${String(key)}' has been defined.`);
			}

			target[INJECTION.SYMBOL.REGISTERED][key] = true;
			
			return Reflect.set(target, key, value, receiver);
		}
	}
};

function Injection(initObject = {}, name = '<anonymous>', _prototype = Object.prototype) {
	if (typeof initObject !== 'object') {
		throw new TypeError('`initObject` MUST be an object.');
	}

	const injection = Object.create(_prototype);
	const proxy = injection.injection = new Proxy(injection, INJECTION.PROXY_OPTIONS);

	Object.assign(injection, initObject);
	injection[INJECTION.SYMBOL.NAME] = name;
	injection.$create = function createChild(initObject, name) {
		return Injection(initObject, name, injection);
	};
	
	const registered = injection[INJECTION.SYMBOL.REGISTERED] = { then: true, inspect: true };

	Object.keys(injection).forEach(key => registered[key] = true);

	return proxy;
}

module.exports = Injection;

// const base = Injection({ a: 1 });
// const c0 = base.$create({ b: 2 });
// const c1 = c0.$create({ c: 3 });

// base.d = 4;
// c1.e = 5;
// c1.a =6;

// c1.a