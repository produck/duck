'use strict';

const normalize =require('./normalize');

function KoaApplicationProvider(options) {
	const Koa = require('koa');
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
}

module.exports = KoaApplicationProvider;

KoaApplicationProvider.KoaRouter = require('./plugins/KoaRouter');
KoaApplicationProvider.Session = require('./plugins/Session');
KoaApplicationProvider.OAuth = require('./plugins/OAuthServer');
KoaApplicationProvider.CasClient = require('./plugins/CasClient');