'use strict';

const AppenderConsole = require('./Appenders/Console');
const GeneralFormat = require('./Formats/General');
const DEFAULT = require('./default');

module.exports = function normalize(_options, categoryName) {
	_options = typeof _options === 'object' ? _options : {};

	const options = {
		format: GeneralFormat(),
		levels: DEFAULT.LEVELS.slice(0),
		AppenderList: [AppenderConsole()],
		preventLevels: [],
		defaultLevel: DEFAULT.LEVEL,
	};

	const {
		label: _label = categoryName,
		format: _format = options.format,
		levels: _levels = options.levels,
		AppenderList: _appenders = options.AppenderList,
		preventLevels: _preventLevels = options.preventLevels,
		defaultLevel: _defaultLevel
	} = _options;

	options.label = _label;
	options.format = _format;
	options.levels = _levels;
	options.AppenderList = _appenders;
	options.preventLevels = _preventLevels;
	options.defaultLevel = _defaultLevel ? _defaultLevel : options.levels[0];

	return options;
};
