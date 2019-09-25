'use strict';

const normalizeLoggerOptions = require('./src/normalizeLoggerOptions');

DuckLog.Appender = {
	File: require('./src/Appenders/File'),
	Stdout: require('./src/Appenders/Stdout'),
	Stderr: require('./src/Appenders/Stderr'),
	Console: require('./src/Appenders/Console')
};

DuckLog.Format = {
	ApacheCLF: require('./src/formats/ApacheCLF'),
	ApacheCLFWithVhost: require('./src/Formats/ApacheCLFWithVhost'),
	ApacheECLF: require('./src/Formats/ApacheECLF'),
	// NginxCombined: require('./src/Formats/NginxCombined'),
	InternalError: require('./src/Formats/InternalError'),
	General: require('./src/formats/General')
};

DuckLog.Adapter = {
	HttpServer: require('./src/Adapters/HttpServer')
};

module.exports = DuckLog;

function DuckLog(loggersOptions) {
	const finalLoggersOptions = normalizeLoggerOptions(loggersOptions);

	return {
		id: 'com.orchange.duck.log',
		name: 'DuckLogger',
		install(injection) {
			const Log = injection.Log = {};

			for (const categoryName in finalLoggersOptions) {
				const options = finalLoggersOptions[categoryName];

				Log[categoryName] = Logger(options);
			}
		}
	};
}

function Logger(options) {
	const log = { list: [], map: {} };

	function append(message) {
		options.appenders.forEach(appender => appender.write(message));
	}

	options.levels.forEach(function (levelName, index) {
		const notPrevented = options.preventLevels.indexOf(levelName) === -1;

		this.push(log.map[levelName] = notPrevented ? function log(message) {
			return append(options.format({
				level: {
					name: levelName,
					number: index
				},
				time: new Date(),
				category: options.label
			}, message));
		} : () => {});
	}, log.list);

	const { defaultLevel } = options;
	const defaultLog = defaultLevel ? log.map[defaultLevel] : log.list[0];

	function logger(message) {
		return defaultLog(message);
	}

	Object.assign(logger, log.map);

	return logger;
}