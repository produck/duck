'use strict';

const KoaRouter = require('@koa/router');
const normalize = require('./src/normalizeOptions');

function KoaRouterPlugin(options) {
	const finalOptions = normalize(options);

	return function install(injection) {
		injection.KoaRouter = KoaRouter;

		const duckWebKoaRouterInjection = injection.$create('DuckWebKoaRouter');

		function buildRouter(options) {
			const koaRouterOptions = {};

			if (options.prefix) {
				koaRouterOptions.prefix = options.prefix;
			}

			const router = new KoaRouter(koaRouterOptions);
			const name = options.Router.name || 'anonymous';
			const injection = duckWebKoaRouterInjection.$create(`DuckWebKoaRouter<${name}>`);

			options.Router(router, injection);
			options.use.forEach(optionsNode => {
				const childRouter = buildRouter(optionsNode);

				if (optionsNode.mount === null) {
					router.use(childRouter.routes());
				} else {
					router.use(optionsNode.mount, childRouter.routes());
				}
			});

			return router;
		}

		injection.AppRouter = function ApplicationRouter() {
			return buildRouter(finalOptions);
		};
	};
}

function DuckWebKoaRouter(assembler) {
	if (typeof assembler !== 'function') {
		throw new TypeError('An assembler MUST be a function.');
	}

	return assembler;
}

KoaRouterPlugin.Router = DuckWebKoaRouter;
KoaRouterPlugin.Plugin = KoaRouterPlugin;
module.exports = KoaRouterPlugin;