'use strict';



module.exports = function normalize(options) {
	if (options) {
		return options;
	}

	const session = require('koa-session');

	return {
		install(app) {
			app.keys = [Math.random().toString(16).substr(2, 8)];
			app.use(session(app));
		},
		destroy(ctx) {
			ctx.session = null;
		},
		get(ctx, key) {
			return ctx.session[key];
		},
		set(ctx, key, value) {
			return ctx.session[key] = value;
		}
	};
}