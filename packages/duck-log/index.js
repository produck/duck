'use strict';

const normalizeLoggerOptions = require('./src/normalizeLoggerOptions');
const { normalize } = require('./src/normalize');

DuckLog.Appender = {
	File: require('./src/Appenders/File'),
	Stdout: require('./src/Appenders/Stdout'),
	Stderr: require('./src/Appenders/Stderr'),
	Console: require('./src/Appenders/Console')
};

DuckLog.Format = {
	ApacheCLF: require('./src/Formats/ApacheCLF'),
	ApacheCLFWithVhost: require('./src/Formats/ApacheCLFWithVhost'),
	ApacheECLF: require('./src/Formats/ApacheECLF'),
	// NginxCombined: require('./src/Formats/NginxCombined'),
	InternalError: require('./src/Formats/InternalError'),
	General: require('./src/Formats/General')
};

DuckLog.Adapter = {
	HttpServer: require('./src/Adapters/HttpServer')
};

module.exports = DuckLog;

/**
 * @returns {import('@produck/duck').Component}
 */
function DuckLog(loggersOptions) {
	const finalLoggersOptions = normalizeLoggerOptions(loggersOptions);

	let installedInjection = null;

	return {
		id: 'org.produck.log',
		name: 'DuckLogger',
		install(injection) {
			const manager = function bootstrap() {
				const options = normalize(finalLoggersOptions, installedInjection);

				for (const categoryName in options) {
					manager[categoryName] = Logger(options[categoryName]);
				}
			};

			injection.Log = manager;
		},
		created({ injection }) {
			installedInjection = injection;
		}
	};
}

function Logger(options) {
	const log = { list: [], map: {} };
	const appenders = options.AppenderList.map(Appender => Appender());

	function append(message) {
		appenders.forEach(appender => appender.write(message));
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