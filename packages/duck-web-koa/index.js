'use strict';

const { Injection } = require('@or-change/duck');
const Koa = require('koa');
const normalizePlugins = require('./src/normalizePluginsOptions');
const defaultCallback = require('./src/defaultCallback');

module.exports = function KoaApplicationProvider(callback = defaultCallback, pluginsOptions) {
	if (typeof callback !== 'function') {
		throw new Error('Argument 0 `callback` MUST be a function.');
	}
	
	const finalPluginsOptions = normalizePlugins(pluginsOptions);

	return function Application(injection) {
		const context = Injection();

		finalPluginsOptions.forEach(install => install(context, injection));

		return function KoaApplication(options) {
			const app = new Koa();
		
			callback(app, context, injection, options);
			
			return app.callback();
		};
	};
};