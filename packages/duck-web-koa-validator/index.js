'use strict';

const Ajv = require('ajv').default;
const debug = require('debug')('duck:web:koa:validator');

const SCOPES = [
	{ name: 'Body', key: 'body' },
	{ name: 'Query', key: 'query' }
];

function ERROR_HANDLER(ctx, errors) {
	return ctx.throw(400, JSON.stringify(errors, null, '  '));
}

module.exports = function DuckWebKoaValidator() {
	return function install(injection) {
		function Validator(schema) {
			const ajv = new Ajv({ allErrors: true, verbose: true });

			return ajv.compile(schema);
		}

		injection.Validator = Validator;
		SCOPES.forEach(scope => {
			Validator[scope.name] = function ValidatorMiddleware(schema, errorHandler = ERROR_HANDLER) {
				const validate = Validator(schema);

				return function middleware(ctx, next) {
					const scopeData = ctx.request[scope.key];

					if (!validate(scopeData)) {
						return errorHandler(ctx, validate.errors);
					}

					return next();
				};
			};
		});

		debug('DuckWebKoaValidator is installed.');
	};
};