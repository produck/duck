'use strict';

const { Normalizer } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer(schema, options => {
	if (Array.isArray(options) && options.length > 0) {
		return options;
	}

	return [
		{
			id: 'Default',
			type: 'untyped',
			Application: function DefaultApplicationProvider({ product }) {
				return function DefaultApplication() {
					return function requestListener(_request, response) {
						response.end(JSON.stringify({
							meta: product.meta,
							components: product.components
						}, null, '  '));
					};
				};
			}
		}
	];
});