'use strict';

module.exports = function DefaultApplicationProvider({ product }) {
	return function DefaultApplication(...args) {
		console.log('Constructor Arguments:\n', ...args);

		return function requestListener(_request, response) {
			response.end(JSON.stringify({
				meta: product.meta,
				components: product.components
			}, null, '  '));
		};
	};
};
