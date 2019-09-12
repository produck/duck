'use strict';

const { Normalizer, Validator } = require('@or-change/duck');
const AppenderConsole = require('./Appenders/Console');
const schema = require('./LoggerOptionsSchema.json');

const DEFAULT_LEVELS = schema.definitions.defaultLevels.enum = [
	'trace', 'debug', 'info', 'warn', 'error', 'fatal'
];

function DEFAULT_FORMAT(meta, message) {
	return `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${message}`;
}

module.exports = Normalizer({
	defaults: () => ({}),
	handler: options => {
		const finalOptions = {
			label: 'default',
			format: DEFAULT_FORMAT,
			levels: DEFAULT_LEVELS.slice(0),
			appenders: [AppenderConsole()],
			preventLevels: [],
			defaultLevel: 'info',
		};

		const {
			label: _label = finalOptions.label,
			format:  _format = finalOptions.format,
			levels: _levels = finalOptions.levels,
			appenders: _appenders = finalOptions.appenders,
			preventLevels: _preventLevels = finalOptions.preventLevels,
			defaultLevel: _defaultLevel = finalOptions.defaultLevel
		} = options;

		finalOptions.label = _label;
		finalOptions.format = _format;
		finalOptions.levels = _levels;
		finalOptions.appenders = _appenders;
		finalOptions.preventLevels = _preventLevels;
		finalOptions.defaultLevel = _defaultLevel;

		return finalOptions;
	},
	validate: Validator(schema)
});