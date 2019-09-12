'use strict';

// const assert = require('assert');
const Duck = require('@or-change/duck');
const DuckLog = require('../');
// const path = require('path');

describe('DuckLog::', function () {
	it('debug', function () {
		Duck({
			id: 'test',
			components: [
				DuckLog()
			],
			installed({ Logger }) {
				const logger = Logger({
					appenders: [
						DuckLog.Appender.Console(),
						// DuckLog.Appender.File()
					]
				});

				logger('111100');
				logger.error('111177');
				logger.trace('111155');
				logger.debug('1111000');
				logger.info('1111000');

				// setInterval(() => {
				// 	logger('This returns a WritableStream. When the current time, formatted as pattern, changes then the current');
				// }, 50);
			}
		});
	});
});