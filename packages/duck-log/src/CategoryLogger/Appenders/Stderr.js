'use strict';

const GLOBAL_STDOUT_APPENDER = Object.freeze({
	write(message) {
		process.stderr.write(message);
	}
});

module.exports = function DuckLogAppenderStderr() {
	return GLOBAL_STDOUT_APPENDER;
};