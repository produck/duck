'use strict';

const assert = require('assert');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');
const DuckWebKoaValidator = require('../');

describe('DuckWebKoaValidator', function () {
	it('debug', function (done) {
		Duck({
			id: 'test',
			components: [
				DuckWeb([
					{
						id: 'DuckWebKoaValidatorTesting',
						Application: DuckWebKoa((app, { AppRouter }) => {
							app.use(AppRouter().routes());
						}, {
							plugins: [
								DuckWebKoaRouter({
									prefix: '/api',
									Router(router, { Validator }, { product }) {
										const validate = Validator.Query({
											type: 'object',
											properties: {
												a: true,
												b: true
											},
											required: ['a', 'b'],
											additionalProperties: false
										});

										router.get('/product', validate, ctx => {
											ctx.body = product.meta;
										});
									}
								}),
								DuckWebKoaValidator()
							]
						})
					}
				])
			]
		}, ({ Web }) => {
			const app = Web.Application('DuckWebKoaValidatorTesting');
			const server = Web.Http.createServer(app).listen();

			Web.Http.request(`http://127.0.0.1:${server.address().port}/api/product`, res => {
				assert.equal(res.statusCode, 400);
				server.close();
				done();
			}).end();
		})
	})
});
