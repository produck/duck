'use strict';

const Ajv = require('ajv');
const AjvKeywords = require('ajv-keywords');
const schema = require('./OptionsSchema.json');

const ajv = new Ajv({
	allErrors: true,
	verbose: true,
});

AjvKeywords(ajv, ['instanceof']);

const validate = ajv.compile(schema);

module.exports = function normalize(options) {
	validate(options);

	if (options) {
		return options;
	}

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
};