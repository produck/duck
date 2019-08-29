'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const schema = require('./OptionsSchema.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
	$data: true
});

AjvKeywords(ajv, ['instanceof']);

const validate = ajv.compile(schema);

module.exports = function normalize(options) {
	const finalOptions = {
		asserts: [],
		table: {},
		throw(symbol, ctx) {
			ctx.throw(403, `The operation '${symbol}' is forbidden.`);
		}
	};

	if (options === undefined) {
		return finalOptions;
	}
	
	const valid = validate(options);
	
	if (!valid) {
		validate.errors.forEach(error => {
			console.error(error);
		});

		throw new Error(JSON.stringify(validate.errors, null, '  '));
	}

	const {
		asserts: _asserts = finalOptions.asserts,
		table: _table = finalOptions.table,
		throw: _throw = finalOptions.throw
	} = options;

	finalOptions.asserts = _asserts;
	finalOptions.table = _table;
	finalOptions.throw = _throw;

	return finalOptions;
}