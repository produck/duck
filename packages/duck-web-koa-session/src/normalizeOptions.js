'use strict';

const { Normalizer, Validator } = require('@produck/duck');
const schema = require('./OptionsSchema.json');

module.exports = Normalizer({
	defaults() {
		const session = require('koa-session');

		return {
			key: 'session',
			install(app) {
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
	},
	validate: Validator(schema)
});