'use strict';

const normalize = require('./normalize');
const noop = () => {};

module.exports = function CategoryLogger(options, categoryName) {
	const finalOptions = normalize(options, categoryName);

	const {
		AppenderList: listOfAppenderFactory,
		levels: listOfLevelName,
		preventLevels: listOfPreventedLevelName,
		format,
		label,
		defaultLevel: defaultLevelName
	} = finalOptions;

	function isPrevented(targetLevelName) {
		return listOfPreventedLevelName
			.some(levelName => levelName === targetLevelName);
	}

	const listOfAppender = listOfAppenderFactory.map(Appender => Appender());

	function appendLogMessage(message) {
		const listOfWriting = listOfAppender.map(appender => appender.write(message));

		return Promise.all(listOfWriting);
	}

	function LevelLogger(levelName) {
		return function levelLogger(messageObject) {
			const message = format({
				level: levelName,
				time: new Date(),
				label: label
			}, messageObject);

			return appendLogMessage(message);
		};
	}

	const listOfLevelLogger = [];
	const mapOfLevelLogger = {};

	listOfLevelName.forEach(levelName => {
		const levelLogger = isPrevented(levelName) ? noop : LevelLogger(levelName);

		listOfLevelLogger.push(levelLogger);
		mapOfLevelLogger[levelName] = levelLogger;
	});

	const defaultLevelLogger = defaultLevelName
		? mapOfLevelLogger[defaultLevelName]
		: listOfLevelLogger[0];

	return Object.assign(function iLogger(message) {
		return defaultLevelLogger(message);
	}, Object.freeze(mapOfLevelLogger));
};
