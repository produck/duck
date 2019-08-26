'use strict';

const normalize = require('./normalize');

module.exports = function KoaRouterPlugin(originalOptions) {
	const KoaRouter = require('koa-router');
	const options = normalize(originalOptions);

	return function install(injection, context) {
		function buildRouter(optionsNode) {
			const options = {};
	
			if (optionsNode.prefix) {
				options.prefix = optionsNode.prefix;
			}
	
			const router = new KoaRouter(optionsNode);
	
			optionsNode.Router(router, injection, context);

			const { children } = optionsNode;

			if (children.length > 0) {
				children.forEach(optionsNode => {
					const childRouter = buildRouter(optionsNode);
					const middleware = childRouter.routes();

					if (optionsNode.mount === null) {
						return router.use(middleware);
					} else {
						return router.use(optionsNode.mount, middleware);
					}
				});
			}

			return router;
		}
			
		context.AppRouterMiddleware = function ApplicationRouterMiddleware() {
			return buildRouter(options).routes();
		};
	};
};