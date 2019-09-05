'use strict';

const { Normalizer } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer(schema, options => {
	if (options === null) {
		options = {};
	}

	const finalOptions = {
		factory(app, { product }) {
			app.use(ctx => {
				ctx.body = 'hello, world!\n\nProduct Meta\n\n';
				ctx.body += JSON.stringify(product.meta, null, '  ');
				ctx.body += '\n\nProduct Components\n\n';
				ctx.body += JSON.stringify(product.components, null, '  ');
				ctx.body += '\n\n--Duck Quack~';
			});
		},
		plugins: []
	};

	const {
		factory: _factory = finalOptions.factory,
		plugins: _plugins = finalOptions.plugins
	} = options;

	finalOptions.factory = _factory;
	finalOptions.plugins = _plugins;

	return finalOptions;
});