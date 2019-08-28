'use strict';

const Duck = require('../index');

const KoaApplication = Duck.Web.Koa({
	plugins: [
		Duck.Web.Koa.KoaRouter({
			prefix: '/api',
			Router(router, { product, injection }) {
				router.get('/product/meta', ctx => {
					injection;
					ctx.state.session.name = 'lichao';
					console.log(ctx.state.session);
					ctx.body = product.meta;
				}).get('/product/components', ctx => {
					ctx.body = product.components;
				});
			},
			use: [
				{
					mount: '/dev',
					// mount: ['/dev', '/test'],
					prefix: '/account',
					Router(router) {
						router.get('/', ctx => {
							ctx.body = {
								foo: 'bar'
							};
						}).post('/project', ctx => {
							ctx.body = {};
						});
					}
				}
			]
		}),
		Duck.Web.Koa.Session()
	],
	factory(app, _injection, { AppRouter, Session }) {
		const router = AppRouter();

		Session(app);
		app.use(router.routes()).use(router.allowedMethods());
	}
});

function KoaApp() {
	const app = {};

	Duck({
		components: [
			Duck.Web([
				{
					id: 'Demo',
					Application: KoaApplication
				}
			]),
			{
				id: 'private.luo.test.panda',
				name: 'TeacherLuo',
				description: 'shishi',
				install(injection) {},
			}
		],
		created({ Web }) {
			app.server = Web.Server('app', 'http', Web.Application.Demo());
		}
	});

	return app;
}

const app = KoaApp();

app.server.listen(80);