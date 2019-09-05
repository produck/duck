'use strict';

const Koa = require('koa');
const normalize = require('./src/normalizeOptions');

module.exports = function KoaApplicationProvider(options) {
	/**
	 * Koa application
	 */
	const { factory, plugins } = normalize(options);
	
	return function Application(injection) {
		/**
		 * Inject product freezen injection.
		 */
		const context = {};

		plugins.forEach(install => install(injection, context));

		return function KoaApplication() {
			/**
			 * Server instance
			 */
			const app = new Koa();
		
			if (factory) {
				factory(app, injection, context);
			}
			
			return app.callback();
		};
	};
};