'use strict';

module.exports = function InternalErrorFormat(withStack = false) {
	return function format(meta, error) {
		if (!error.message) {
			throw new TypeError('Can NOT handle an error object without property `message`.');
		}

		const base = `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${error.message}`;

		return withStack ? `${base}\n${JSON.stringify(error.stack)}` : base;
	};
};