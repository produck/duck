'use strict';

function Injection(initObject) {
	const injection = Object.assign({ Injection }, initObject);
	const registered = {
		then: true,
		inspect: true
	};

	injection.injection = injection;
	
	Object.keys(injection).forEach(key => registered[key] = true);

	return new Proxy(injection, {
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
}

module.exports = Injection;