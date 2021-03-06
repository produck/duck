'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckWebKoa = require('@produck/duck-web-koa');
const DuckWebKoaRouter = require('@produck/duck-web-koa-router');
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
									Router(router, { Validator, product }) {
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
			const server = http.createServer(app).listen();

			http.request(`http://127.0.0.1:${server.address().port}/api/product`, res => {
				assert.equal(res.statusCode, 400);
				server.close();
				done();
			}).end();
		})();
	});
});
