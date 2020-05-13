'use strict';

const { RollingFileStream } = require('streamroller');
const path = require('path');
const debug = require('debug')('duck:log:appender:file');
const os = require('os');
const { Normalizer, Validator } = require('@or-change/duck');

const EOL = os.EOL || '\n';

const normalize = Normalizer({
	defaults: () => ({}),
	handler: options => {
		const finalOptions = {
			file: {
				pathname: path.resolve('logs/default.log'),
				size: 64 * 1024,
				number: 4
			},
			streamOptions: {
				keepFileExt: true
			}
		};

		const {
			file: _file = finalOptions.file
		} = options;

		if (_file) {
			const {
				pathname: _pathname = finalOptions.file.pathname,
				size: _size = finalOptions.file.size,
				number: _number = finalOptions.file.number
			} = _file;

			finalOptions.file.pathname = _pathname;
			finalOptions.file.size = _size;
			finalOptions.file.number = _number;
		}

		return finalOptions;
	},
	validate: Validator({
		type: 'object',
		additionalProperties: false,
		properties: {
			file: {
				type: 'object',
				additionalProperties: false,
				properties: {
					pathname: {
						oneOf: [
							{
								instanceof: 'Function',
							},
							{
								type: 'string'
							}
						]
					},
					size: {},
					number: {
						type: 'integer'
					}
				}
			},
			streamOptions: {
				encoding: {},
				mode: {},
				flags: {},
				compress: {},
				keepFileExt: {}
			}
		}
	})
});

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