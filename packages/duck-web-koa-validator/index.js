'use strict';

const Ajv = require('ajv');
const SCOPES = [
	{
		name: 'Body',
		getData(ctx) {
			return ctx.request.body;
		}
	},
	{
		name: 'Query',
		getData(ctx) {
			return ctx.request.query;
		}
	},
	{
		name: 'Headers',
		getData(ctx) {
			return ctx.request.headers;
		}
	}
];

module.exports = function DuckWebKoaValidator() {

	return function install({ Debug }, context) {
		const debug = Debug('duck:web:koa:validator');

		context.Validator = SCOPES.map(scope => function ScopeValidatorMiddleware(schema, options) {
			const ajv = new Ajv({ allErrors: true, verbose: true });
			const validate = ajv.compile(schema);

			return function middleware(ctx, next) {
				const scopeData = scope.getData(ctx);

				if (!validate(scopeData)) {
					//TODO create error body

					return ctx.throw(400);
				}

				return next();
			};
		});
	};
};