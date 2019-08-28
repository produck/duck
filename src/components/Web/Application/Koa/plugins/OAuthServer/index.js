'use strict';

const DEFAULT_BODY = function DefaultBody() {
	return {};
};

module.exports = function OAuthPlugin(options) {
	const OAuthServer = require('@or-change/oauth');

	return function install(_injection, context) {
		const handler = OAuthServer(options);

		context.OAuth = function OAuthInstaller(app, Body = DEFAULT_BODY) {
			app.use(async (ctx, next) => {
				await handler(ctx.req, ctx.res, Body(ctx));

				if (!ctx.res.finished) {
					return next();
				}
			});

			return app;
		};
	};
};