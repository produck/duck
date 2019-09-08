'use strict';

const { Injection } = require('@or-change/duck');
const Koa = require('koa');
const normalizePlugins = require('./src/normalizePluginsOptions');
const defaultCallback = require('./src/defaultCallback');

module.exports = function KoaApplicationProvider(callback = defaultCallback, pluginsOptions) {
	const finalPluginsOptions = normalizePlugins(pluginsOptions);

	if (typeof callback !== 'function') {
		throw new Error('Argument[0] `callback` MUST be a function.');
	}

	return function Application(injection) {
		const context = Injection();

		finalPluginsOptions.forEach(install => install(context, injection));

		return function KoaApplication() {
			const app = new Koa();
		
			callback(app, context, injection);
			
			return app.callback();
		};
	};
};