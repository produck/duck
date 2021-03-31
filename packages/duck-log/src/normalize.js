'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const schema = require('./OptionsSchema.json');
const DEFAULT = require('./CategoryLogger/default');

schema.definitions.defaultLevels.enum = DEFAULT.LEVELS;

module.exports = Normalizer({
	defaults: () => ({}),
	handler: function normalize(_options) {
		const options = {};

		for (const categoryName in _options) {
			options[categoryName] = _options[categoryName];
		}

		return options;
	},
	validate: Validator(schema)
});
