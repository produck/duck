'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const schema = require('./OptionsSchema.json');
const normalizeCategoryOptions = require('./CategoryLogger/normalize');
const DEFAULT = require('./CategoryLogger/default');

schema.definitions.defaultLevels.enum = DEFAULT.LEVELS;

module.exports = Normalizer({
	handler: function normalize(_options) {
		const options = {};

		for (const categoryName in _options) {
			options[categoryName] =
				normalizeCategoryOptions(_options[categoryName], categoryName);
		}

		return options;
	},
	validate: Validator(schema)
});
