'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const AppenderConsole = require('./Appenders/Console');
const GeneralFormat = require('./Formats/General');
const { DEFAULT_LEVELS, normalize, schema } = require('./normalize');

module.exports = Normalizer({
	defaults: () => {
		return {
			default: {
				label: 'default',
				format: GeneralFormat(),
				levels: DEFAULT_LEVELS.slice(0),
				AppenderList: [AppenderConsole()],
				preventLevels: [],
				defaultLevel: 'info',
			}
		};
	},
	handler: normalize,
	validate: Validator(schema)
});