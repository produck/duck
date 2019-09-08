'use strict';

const normalize = require('./src/normalizeOptions');

module.exports = function KoaRouterPlugin(options) {
	const KoaRouterMouduleName = ['koa-router', '@koa/router'].find(moduleName => {
		try {
			require.resolve(moduleName);
			return true;
		} catch(error) {
			return false;
		}
	});

	if (!KoaRouterMouduleName) {
		throw new Error('Cannot find module \'koa-router\' or \'@koa/router\'.');
	}

	const KoaRouter = require(KoaRouterMouduleName);
	const finalOptions = normalize(options);

	return function install(context, injection) {
		context.KoaRouter = KoaRouter;
		
		function buildRouter(options) {
			const koaRouterOptions = {};
	
			if (options.prefix) {
				koaRouterOptions.prefix = options.prefix;
			}
	
			const router = new KoaRouter(koaRouterOptions);
	
			options.Router(router, injection, context);
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
		
		context.AppRouter = function ApplicationRouter() {
			return buildRouter(finalOptions);
		};
	};
};