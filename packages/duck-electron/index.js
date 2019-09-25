'use strict';

const Electron = require('electron');
const debug = require('debug')('duck:electron');
const atElectronRuntime = typeof Electron !== 'string';

if (!atElectronRuntime) {
	console.warn('It is NOT in electron runtime & bootstrap will be ignored.');
}

function DuckElectron(bootstrap, plugins = []) {
	const electron = {
		injection: null
	};

	return {
		id: 'com.oc.duck.electron',
		name: 'DuckElectron',
		description: '',
		install(injection) {
			electron.injection = injection.$create('DuckElectron');
			injection.Electron = Electron;
			plugins.forEach(install => install(electron.injection));
		},
		created() {
			if (atElectronRuntime) {
				debug('Electron bootstrap...');
				bootstrap(electron.injection);
			}
		}
	};
}

module.exports = DuckElectron;