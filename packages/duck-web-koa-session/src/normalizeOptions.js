'use strict';

const { Normalizer } = require('@or-change/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer(schema, options => {
	return options ? options : {
		key: 'session',
		install(app) {
			const session = require('koa-session');

			app.keys = [Math.random().toString(16).substr(2, 8)];
			app.use(session(app));
		},
		destroy(ctx) {
			ctx.session = null;
		},
		get(ctx) {
			return ctx.session;
		},
		set(ctx, value) {
			return ctx.session = value;
		}
	};
});