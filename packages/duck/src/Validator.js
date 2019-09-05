'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');

function DEFAULT_AJV_MODIFIER(ajv) {
	AjvKeywords(ajv, ['instanceof']);
}

module.exports = function DuckAjvValidator(schema, ajvModifier = DEFAULT_AJV_MODIFIER) {
	if (typeof ajvModifier !== 'function') {
		throw new TypeError('`ajvModifier` MUST be a function.');
	}

	const ajv = new Ajv({ allErrors: true, verbose: true });

	ajvModifier(ajv);

	const ajvValidater = ajv.compile(schema);

	return function validate(options) {
		if (!ajvValidater(options)) {
			const errors = [];

			ajvValidater.errors.forEach(error => {
				errors.push({
					keyword: error.keyword,
					dataPath: error.dataPath,
					schemaPath: error.schemaPath,
					message: error.message
				});
			});
	
			throw errors;
		}

		return true;
	};
};