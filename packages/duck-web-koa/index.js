'use strict';

const Koa = require('koa');
const normalizePlugins = require('./src/normalizePluginsOptions');

function DEFAULT_FACTORY(app, { product }) {
	app.use(ctx => {
		ctx.body = [
			'hello, world!',
			'Product Meta',
			JSON.stringify(product.meta, null, '  '),
			'Product Components',
			JSON.stringify(product.components, null, '  '),
			'--Duck Quack~',
		].join('\n\n');
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