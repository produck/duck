'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer({
	defaults() {
		return {};
	},
	handler(options) {
		const finalOptions = {
			asserts: [],
			table: {},
			throw(symbol, ctx) {
				ctx.throw(403, `The operation '${symbol}' is forbidden.`);
			}
		};

		const {
			asserts: _asserts = finalOptions.asserts,
			table: _table = finalOptions.table,
			throw: _throw = finalOptions.throw
		} = options;

		finalOptions.asserts = _asserts;
		finalOptions.table = _table;
		finalOptions.throw = _throw;

		return finalOptions;
	},
	validate: Validator(schema)
});