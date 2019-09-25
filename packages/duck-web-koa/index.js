'use strict';

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

	return function Application(webInjection) {
		const webKoaInjection = webInjection.$create('DuckWebKoa');

		finalOptions.plugins.forEach(install => install(webKoaInjection));
		finalOptions.installed(webKoaInjection);

		return function KoaApplication(options) {
			const app = new Koa();

			factory(app, webKoaInjection, options);

			return app.callback();
		};
	};
};