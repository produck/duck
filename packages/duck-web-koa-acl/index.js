'use strict';

const normalize = require('./src/normalizeOptions');

module.exports = function AccessControlPlugin(originalOptions) {
	const options = normalize(originalOptions);

	return function install(injection, context) {
		context.AccessControl = function AccessControlMiddleware(symbol) {
			function authorize(ctx) {
				const symbolRule = options.table[symbol];
		
				if (!symbolRule) {
					throw new Error('Symbol is NOT defined.');
				}

				const evaluations = symbolRule.map((required, index) => {
					return !required || options.asserts[index](ctx, injection);
				});
		
				return Promise.all(evaluations)
					.then((conclusions) => conclusions.every(value => value));
			}

			return async function middleware(ctx, next) {
				if (await authorize(ctx)) {
					return next();
				}

				await options.throw(symbol, ctx, injection);
			};
		};
	};
};