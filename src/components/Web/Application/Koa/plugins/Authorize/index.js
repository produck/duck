'use strict';

function normalize(options) {
	const finalOptions = {
		authorize() {
			return true;
		},
		throw(symbol, ctx) {
			ctx.throw(403, `The operation '${symbol}' is forbidden.`);
		}
	};

	const {
		authorize: _authorize = finalOptions.authorize
	} = options;

	if (typeof _authorize !== 'function') {
		throw new Error('Invalid `options.authorize`, function expected.');
	}

	finalOptions.authorize = _authorize;

	return finalOptions;
}

module.exports = function AccessControlPluginProvider(originalOptions) {
	const options = normalize(originalOptions);

	return function AccessControlPlugin(injection, context) {
		context.Authorize = function AuthorizeMiddlerware(symbol) {
			return async function middleware(ctx, next) {
				if (await options.authorize(symbol, ctx, injection)) {
					return next();
				}

				await options.throw(symbol, ctx, injection);
			};
		};
	};
};