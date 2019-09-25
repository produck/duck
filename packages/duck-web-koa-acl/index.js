'use strict';

const normalize = require('./src/normalizeOptions');

module.exports = function AccessControlPlugin(options) {
	const finalOptions = normalize(options);

	return function install(injection) {
		injection.AccessControl = function AccessControlMiddleware(symbol) {
			function authorize(ctx) {
				const symbolRule = finalOptions.table[symbol];

				if (!symbolRule) {
					throw new Error('Symbol is NOT defined.');
				}

				const evaluations = symbolRule.map((required, index) => {
					return !required || finalOptions.asserts[index](ctx, injection);
				});

				return Promise.all(evaluations)
					.then((conclusions) => conclusions.every(value => value));
			}

			return async function middleware(ctx, next) {
				if (await authorize(ctx)) {
					return next();
				}

				await finalOptions.throw(symbol, ctx, injection);
			};
		};
	};
};