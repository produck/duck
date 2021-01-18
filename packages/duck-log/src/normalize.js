'use strict';

const schema = require('./LoggerOptionsSchema.json');
const AppenderConsole = require('./Appenders/Console');
const GeneralFormat = require('./Formats/General');

const DEFAULT_LEVELS = schema.definitions.defaultLevels.enum = [
	'trace', 'debug', 'info', 'warn', 'error', 'fatal'
];

function normalize(loggersOptions, injection = null) {
	const finalLoggersOptions = {};

	for (const categoryName in loggersOptions) {
		const options = loggersOptions[categoryName];

		if (typeof options === 'function' && injection === null) {
			finalLoggersOptions[categoryName] = options;
		} else {
			const finalOptions = {
				format: GeneralFormat(),
				levels: DEFAULT_LEVELS.slice(0),
				AppenderList: [AppenderConsole()],
				preventLevels: [],
				defaultLevel: 'info',
			};

			const {
				format:  _format = finalOptions.format,
				levels: _levels = finalOptions.levels,
				AppenderList: _appenders = finalOptions.AppenderList,
				preventLevels: _preventLevels = finalOptions.preventLevels,
				defaultLevel: _defaultLevel = finalOptions.defaultLevel
			} = typeof options === 'function' ? options(injection) : options;

			finalOptions.label = categoryName;
			finalOptions.format = _format;
			finalOptions.levels = _levels;
			finalOptions.AppenderList = _appenders;
			finalOptions.preventLevels = _preventLevels;
			finalOptions.defaultLevel = _defaultLevel;

			finalLoggersOptions[categoryName] = finalOptions;
		}

	}

	return finalLoggersOptions;
}

exports.normalize = normalize;
exports.DEFAULT_LEVELS = DEFAULT_LEVELS;
exports.schema = schema;