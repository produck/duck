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

module.exports = function normalizeWebOptions(options = []) {
	const valid = validate(options);

	if (!valid) {
		validate.errors.forEach(error => {
			console.error(error);
		});

		throw new Error(JSON.stringify(validate.errors, null, '  '));
	}
	
	if (typeof options !== 'undefined') {
		return options;
	}

	const finalOptions = [
		{
			id: 'Default',
			type: 'untyped',
			Application: function DefaultApplicationProvider({ product }) {
				return function DefaultApplication() {
					return function requestListener(_request, response) {
						response.end(JSON.stringify({
							meta: product.meta,
							components: product.components
						}, null, '  '));
					};
				};
			}
		}
	];

	return finalOptions;
};