'use strict';

const normalize = require('./src/normalizeOptions');

module.exports = function SessionPlugin(originalOptions) {
	const options = normalize(originalOptions);

	return function install(injection) {
		injection.Session = function install(app) {
			options.install(app);
			app.use(async (ctx, next) => {
				Object.defineProperty(ctx.state, options.key, {
					get() {
						return options.get(ctx);
					},
					set(any) {
						if (any === null) {
							options.destroy(ctx);
						}

						options.set(ctx, any);
					}
				});

				return next();
			});

			return app;
		};
	};
};