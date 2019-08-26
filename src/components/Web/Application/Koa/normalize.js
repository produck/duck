'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const schema = require('./schema.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
});

AjvKeywords(ajv, ['instanceof']);

const validate = ajv.compile(schema);

module.exports = function normalizeKoaOptions(options = {}) {
	const valid = validate(options);

	if (!valid) {
		validate.errors.forEach(error => {
			console.error(error);
		});

		throw new Error(JSON.stringify(validate.errors, null, '  '));
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
};