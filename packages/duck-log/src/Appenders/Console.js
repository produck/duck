'use strict';

module.exports = function DuckLogConsoleAppenderProvider() {
	const consoleLog = console.log.bind(console);

	return function DuckLogConsoleAppender() {
		return {
			write(message) {
				consoleLog(message);
			}
		};
	};
};