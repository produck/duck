'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');

const AJV = {
	MODIFIER(ajv) {
		AjvKeywords(ajv, ['instanceof']);
	},
	OPTIONS: {
		allErrors: true,
		verbose: true,
		$data: true
	}
};

module.exports = function DuckAjvValidator(schema, ajvModifier = AJV.MODIFIER) {
	if (typeof ajvModifier !== 'function') {
		throw new TypeError('`ajvModifier` MUST be a function.');
	}

	const ajv = new Ajv(AJV.OPTIONS);

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
					message: error.message,
					params: error.params
				});
			});

			throw new Error(errors.reduce((message, error) => {
				return message + '\n\r' + JSON.stringify(error);
			}, ''));
		}

		return true;
	};
};