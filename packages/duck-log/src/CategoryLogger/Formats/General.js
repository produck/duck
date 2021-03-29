'use strict';

module.exports = function GeneralFormat() {
	return function format(meta, message) {
		if (typeof message !== 'string') {
			throw new TypeError('The `message` MUST be a string.');
		}

		return `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${message}`;
	};
};