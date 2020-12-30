'use strict';

const { Normalizer, Validator } = require('@produck/duck');

module.exports = Normalizer({
	defaults: () => ({}),
	handler: options => {
		const finalOptions = {
			installed: () => {},
			plugins: []
		};

		const {
			installed: _installed = finalOptions.installed,
			plugins: _plugins = finalOptions.plugins
		} = options;

		finalOptions.installed = _installed;
		finalOptions.plugins = _plugins;

		return finalOptions;
	},
	validate: Validator({
		type: 'object',
		additionalProperties: false,
		properties: {
			plugins: {
				type: 'array',
				items: {
					instanceof: 'Function'
				}
			},
			installed: {
				instanceof: 'Function'
			}
		}
	})
});