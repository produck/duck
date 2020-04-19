'use strict';

function getInjectionRegistered(injection) {
	const registered = {};

	while (injection !== Object.prototype) {
		Object.assign(registered, injection[INJECTION.SYMBOL.REGISTERED]);
		injection = Object.getPrototypeOf(injection);
	}

	return registered;
}

function InjectionErrorMessage(injection, message) {
	const chain = [];

	while (injection !== Object.prototype) {
		chain.push(injection[INJECTION.SYMBOL.NAME]);
		injection = Object.getPrototypeOf(injection);
	}

	return `${message}\n[${chain.join('] --|> [')}]`;

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
				throw new Error(InjectionErrorMessage(target, `The dependence named '${String(key)}' is NOT defined.`));
			}

			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			if (typeof key === 'symbol') {
				throw new Error(InjectionErrorMessage(target, 'The dependence key in injection can NOT be a symbol.'));
			}

			if (Object.prototype.hasOwnProperty.call(target, key)) {
				throw new Error(InjectionErrorMessage(target, `The dependence named '${String(key)}' has been defined.`));
			}

			target[INJECTION.SYMBOL.REGISTERED][key] = true;

			return Reflect.set(target, key, value, receiver);
		}
	}
};

function Injection(name = '<Anonymous>', _parent = Object.prototype) {
	if (typeof name !== 'string') {
		throw new TypeError('Injection() `name` MUST be a string.');
	}

	/**
	 * Make the new injection extends from a parent injection by `parent`.
	 * The `parent` MUST be an injection or `Object.prototype` if it is a root injection.
	 */
	const injection = Object.create(_parent);
	const proxy = injection.injection = new Proxy(injection, INJECTION.PROXY_OPTIONS);

	injection[INJECTION.SYMBOL.NAME] = name;

	injection.$create = function createChild(name) {
		return Injection(name, injection);
	};

	const registered = injection[INJECTION.SYMBOL.REGISTERED] = { then: true, inspect: true };

	Object.keys(injection).forEach(key => registered[key] = true);

	return proxy;
}

module.exports = Injection;