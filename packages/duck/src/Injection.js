'use strict';

const INJECTION = {
	SYMBOL: {
		NAME: Symbol('injection#name'),
	},
	PROXY_OPTIONS: {
		get(target, key, receiver) {
			if (typeof key !== 'symbol' && target[key] === undefined) {
				throw new Error(`\nThe dependence named '${String(key)}' is NOT defined.`);
			}

			if (key === '$create') {
				return target.$create.bind(target);
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
			
			return Reflect.set(target, key, value, receiver);
		}
	}
};

function Injection(initObject = {}, name = '<anonymous>', _prototype = Object.prototype) {
	if (typeof initObject !== 'object') {
		throw new TypeError('`initObject` MUST be an object.');
	}

	const injection = Object.create(_prototype);

	injection[INJECTION.SYMBOL.NAME] = name;
	Object.assign(injection, initObject);
	
	injection.$create = function createChild(initObject, name) {
		return Injection(initObject, name, injection);
	};

	return injection.injection = new Proxy(injection, INJECTION.PROXY_OPTIONS);
}

module.exports = Injection;

const base = Injection({ a: 1 });
const c0 = base.$create({ b: 2 });
const c1 = c0.$create({ c: 3 });

base.d = 4;
c1.e = 5;
c1.a =6;