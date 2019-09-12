'use strict';

const consoleLog = console.log.bind(console);

module.exports = function DuckLogAppenderConsole() {
	return {
		write(message) {
			consoleLog(message);
		}
	};
};