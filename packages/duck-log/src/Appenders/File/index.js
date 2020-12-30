'use strict';

const { RollingFileStream } = require('streamroller');
const debug = require('debug')('duck:log:appender:file');
const os = require('os');
const normalize = require('./normalize');

const EOL = os.EOL || '\n';

module.exports = function DuckLogFileAppenderProvider(options) {
	const finalOptions = normalize(options);
	const { file, streamOptions } = finalOptions;

	return function DuckLogFileAppender(injection) {
		debug('Creating file appender (%j).', file);

		const pathname = typeof file.pathname === 'string' ?
			file.pathname :
			file.pathname(injection);

		const stream = new RollingFileStream(pathname, file.size, file.number, streamOptions);

		stream.on('error', error => {
			console.error('DuckLogFileAppender - Writing to file %s, error happened ', file, error); //eslint-disable-line
		});

		return {
			write(message) {
				stream.write(message + EOL, 'utf-8');
			}
		};
	};
};