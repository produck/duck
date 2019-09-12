'use strict';

const normalizeLoggerOptions = require('./src/normalizeLoggerOptions');

DuckLog.Appender = {
	File: require('./src/Appenders/File'),
	Stdout: require('./src/Appenders/Stdout'),
	Stderr: require('./src/Appenders/Stderr'),
	Console: require('./src/Appenders/Console')
};

module.exports = DuckLog;

function NOOP () {}

function DuckLog() {
	let configurable = true;

	return {
		id: 'com.orchange.duck.log',
		name: 'DuckLogger',
		install(injection) {
			injection.Logger = Object.freeze(function Logger(options) {
				if (!configurable) {
					throw new Error('Configuration can only be done during component installation.');
				}

				const finalOptions = normalizeLoggerOptions(options);
				const log = { list: [], map: {} };
				
				function append(message) {
					finalOptions.appenders.forEach(appender => appender.write(message));
				}

				finalOptions.levels.map(function (levelName, index) {
					const notPrevented = finalOptions.preventLevels.indexOf(levelName) === -1;

					this.push(log.map[levelName] = notPrevented ? function log(message) {
						return append(finalOptions.format({
							level: {
								name: levelName,
								number: index
							},
							time: new Date(),
							category: finalOptions.label
						}, message));
					} : NOOP);
				}, log.list);

				const { defaultLevel } = finalOptions;
				const defaultLog = defaultLevel ? log.map[defaultLevel] : log.list[0];

				function logger(message) {
					return defaultLog(message);
				}

				Object.assign(logger, log.map);

				return logger;
			});
		},
		created() {
			configurable = false;
		}
	};
}