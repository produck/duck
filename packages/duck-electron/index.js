'use strict';

function DuckElectron(bootstrap, plugins = []) {
	const Electron = require('electron');
	const context = {};

	return {
		id: 'com.oc.duck.electron',
		name: 'DuckElectron',
		description: '',
		install(injection) {
			injection.Electron = Electron;
			plugins.forEach(install => install(injection, context));
			Object.freeze(context);
		},
		created(injection) {
			bootstrap(injection, context);
		}
	};
}

module.exports = DuckElectron;