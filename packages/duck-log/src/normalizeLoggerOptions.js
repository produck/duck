'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const AppenderConsole = require('./Appenders/Console');
const GeneralFormat = require('./Formats/General');
const schema = require('./LoggerOptionsSchema.json');

const DEFAULT_LEVELS = schema.definitions.defaultLevels.enum = [
	'trace', 'debug', 'info', 'warn', 'error', 'fatal'
];

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
	handler: loggersOptions => {
		const finalLoggersOptions = {};

		for (const categoryName in loggersOptions) {
			const options = loggersOptions[categoryName];

			const finalOptions = {
				label: 'default',
				format: GeneralFormat(),
				levels: DEFAULT_LEVELS.slice(0),
				AppenderList: [AppenderConsole()],
				preventLevels: [],
				defaultLevel: 'info',
			};

			const {
				label: _label = finalOptions.label,
				format:  _format = finalOptions.format,
				levels: _levels = finalOptions.levels,
				AppenderList: _appenders = finalOptions.AppenderList,
				preventLevels: _preventLevels = finalOptions.preventLevels,
				defaultLevel: _defaultLevel = finalOptions.defaultLevel
			} = options;

			finalOptions.label = _label;
			finalOptions.format = _format;
			finalOptions.levels = _levels;
			finalOptions.AppenderList = _appenders;
			finalOptions.preventLevels = _preventLevels;
			finalOptions.defaultLevel = _defaultLevel;

			finalLoggersOptions[categoryName] = finalOptions;
		}

		return finalLoggersOptions;
	},
	validate: Validator(schema)
});