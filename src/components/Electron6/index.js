'use strict';

function ComponentElectron(bootstrap, plugins = []) {
	const Electron = require('electron');
	const context = {
		windows: new WeakMap()
	};

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

ComponentElectron.Window = require('./plugins/WindowApplication');

module.exports = ComponentElectron;