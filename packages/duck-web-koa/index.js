'use strict';

const { Injection } = require('@or-change/duck');
const Koa = require('koa');
const normalizePlugins = require('./src/normalizeOptions');

module.exports = function KoaApplicationProvider(callback = () => {}, pluginsOptions) {
	/**
	 * Koa application
	 */
	const finalPluginsOptions = normalizePlugins(pluginsOptions);

	return function Application(injection) {
		const context = Injection();

		finalPluginsOptions.forEach(install => install(injection, context));

		return function KoaApplication() {
			/**
			 * Server instance
			 */
			const app = new Koa();
		
			callback(app, injection, context);
			
			return app.callback();
		};
	};
};