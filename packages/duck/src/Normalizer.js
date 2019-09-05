'use strict';

const Validator = require('./Validator');
const validateOptions = Validator({
	type: 'object',
	additionalProperties: false,
	required: [],
	properties: {
		handler: {
			instanceof: 'Function'
		},
		defaults: {}
	}
});

module.exports = function Normalize(options, validate = () => {}) {
	if (typeof validate !== 'function') {
		throw new Error('Optional `validate()` MUST be a functioin.');
	}

	validateOptions(options);

	const {
		handler = any => any,
		defaults = undefined
	} = options;

	return function normalize(any = defaults) {
		validate(any);

		return handler(any);
	};
};