'use strict';

const { Normalizer, Validator } = require('@or-change/duck');

module.exports = Normalizer({
	defaults() {
		return [];
	},
	validate: Validator({
		type: 'array',
		items: {
			instanceof: 'Function'
		}
	})
});