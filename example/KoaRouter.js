'use strict';

const Duck = require('../index');

const KoaApplication = Duck.Web.Koa({
	plugins: [
		Duck.Web.Koa.KoaRouter({
			prefix: '/api',
			Router(router, { product, Web }, { AccessControl }) {
				router.get('/product/meta', AccessControl('meta.query') ,ctx => {
					ctx.state.session.name = 'lichao';
					console.log(ctx.state.session);
					ctx.body = product.meta;
				}).get('/product/components', ctx => {
					ctx.body = product.components;
				}).get('/server', ctx => {
					ctx.body = Object.keys(Web.servers);
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
		Duck.Web.Koa.Session(),
		Duck.Web.Koa.AccessControl({
			asserts: [
				function test(ctx, injection) {
					console.log(ctx, injection);

					return false;
				},
				function test(ctx, injection) {
					console.log(ctx, injection);

					return true;
				}
			],
			table: {
				'meta.query': [0, 0]
			}
		})
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
		id: 'com.orchange.duck.demo',
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
				install() {},
			},
			Duck.Webpack({
				'app.sdlc'(injection, ...args) {
					console.log(injection, args);

					return {};
				}
			}),
			Duck.Datahub([
				{
					id: 'com.oc.duck.datahub.test',
					alias: 'db',
					models: {
						Account(injection) {
							console.log(injection);

							return {
								schemas: {
									type: 'object',
									properties: {
										administrator: { type: 'boolean' },
										id: { type: 'string' },
										name: { type: 'string' },
										email: { type: 'string' },
										avatar: { type: 'string' }
									},
									allowNull: ['email']
								},
								methods: {
									create(payload) {
										return injection.account.create(payload);
									},
									delete(payload) {
										return injection.account.delete(payload);
									},
									update(items) {
										return injection.store.updateAccount(this.id, items);
									},
									query(accountId) {
										return injection.store.getAccountById(accountId);
									}
								}
							};
						},
					}
				}
			])
		]
	}, function created({ Web, Webpack }) {
		app.server = Web.Server('app', 'http', Web.Application.Demo());
		const sdlc = Webpack('app.sdlc');

		console.log(sdlc, 1, 2, 3);
	});

	return app;
}

const app = KoaApp();

app.server.listen(80);