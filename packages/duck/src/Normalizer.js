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
		defaults: {
			instanceof: 'Function'
		},
		validate: {
			instanceof: 'Function'
		}
	}
});

module.exports = function Normalize(options = {}) {
	validateOptions(options);

	const {
		handler = any => any,
		defaults = () => undefined,
		validate = () => true
	} = options;

	return function normalize(any = defaults()) {
		validate(any);

		return handler(any);
	};
};