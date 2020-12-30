'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const path = require('path');
const StreamOptionsSchema = require('./StreamOptionsSchema.json');

module.exports = Normalizer({
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
	validate: Validator(StreamOptionsSchema)
});