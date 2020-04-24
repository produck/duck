'use strict';

const { Normalizer, Validator } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer({
	defaults() {
		return [];
	},
	validate: Validator(schema)
});