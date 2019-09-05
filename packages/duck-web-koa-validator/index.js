'use strict';

const Ajv = require('ajv');
const debug = require('debug')('duck:web:koa:validator');

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

	return function install(_injection, context) {

		function Validator(schema) {
			const ajv = new Ajv({ allErrors: true, verbose: true });
			
			return ajv.compile(schema);
		}

		context.Validator = Validator;
		
		SCOPES.map(scope => function ScopeValidatorMiddleware(schema, options) {
			const validate = Validator(schema);

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