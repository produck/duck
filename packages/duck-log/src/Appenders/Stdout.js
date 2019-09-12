'use strict';

const GLOBAL_STDOUT_APPENDER  = Object.freeze({
	write(message) {
		process.stdout.write(`${message}\n`);
	}
});

module.exports = function DuckLogAppenderStdout() {
	return GLOBAL_STDOUT_APPENDER;
};