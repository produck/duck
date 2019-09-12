'use strict';

const { Injection } = require('@or-change/duck');
const Koa = require('koa');
const normalizePlugins = require('./src/normalizePluginsOptions');

function DEFAULT_FACTORY(app, _context, { product }) {
	app.use(ctx => {
		ctx.body = 'hello, world!\n\nProduct Meta\n\n';
		ctx.body += JSON.stringify(product.meta, null, '  ');
		ctx.body += '\n\nProduct Components\n\n';
		ctx.body += JSON.stringify(product.components, null, '  ');
		ctx.body += '\n\n--Duck Quack~';
	});
}

module.exports = function KoaApplicationProvider(factory = DEFAULT_FACTORY, options) {
	if (typeof factory !== 'function') {
		throw new Error('Argument 0 `factory` MUST be a function.');
	}
	
	const finalOptions = normalizePlugins(options);

	return function Application(injection) {
		const context = Injection();

		finalOptions.plugins.forEach(install => install(context, injection));
		finalOptions.installed(context, injection);

		return function KoaApplication(options) {
			const app = new Koa();
		
			factory(app, context, injection, options);
			
			return app.callback();
		};
	};
};