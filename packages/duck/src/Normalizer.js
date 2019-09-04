'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');

module.exports = function Normalize(schema, optionsHandler = () => {}, ajvHandler = () => {}) {
	const ajv = new Ajv({ allErrors: true, verbose: true });
	
	AjvKeywords(ajv, ['instanceof']);
	ajvHandler(ajv);
	
	const validate = ajv.compile(schema);

	return function normalize(options) {
		if (!validate(options)) {
			validate.errors.forEach(error => {
				console.error(error);
			});
	
			throw new Error(JSON.stringify(validate.errors, null, '  '));
		}

		return optionsHandler(options);
	};
};