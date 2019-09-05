'use strict';

const normalize = require('./src/normalizeOptions');

module.exports = function SessionPlugin(originalOptions) {
	const options = normalize(originalOptions);

	return function install(_injection, context) {
		context.Session = function install(app) {
			options.install(app);
			app.use(async (ctx, next) => {
				Object.defineProperty(ctx.state, options.key, {
					get() {
						return options.get(ctx);
					},
					set(any) {
						if (any === null) {
							return options.destroy(ctx);
						}

						return options.set(ctx, any);
					}
				});
	
				return next();
			});

			return app;
		};
	};
};