'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaRouter = require('../');

function APIRouter(router, _context, { foo }) {
	router.get('/', ctx => {
		ctx.body = foo;
		ctx.status = 201;
	});
}

function TestRouter(router, _context, { baz }) {
	router.get('/', ctx => {
		ctx.body = baz;
		ctx.status = 202;
	});
}

describe('DuckWebKoaRouter::', function () {
	it('debug', function (done) {
		Duck({
			id: 'test',
			injection: {
				foo: 'bar',
				baz: 2
			},
			components: [
				DuckWeb([
					{
						id: 'Testing',
						Application: DuckWebKoa((app, { AppRouter }) => {
							app.use(AppRouter().routes());
						}, {
							plugins: [
								DuckWebKoaRouter({
									prefix: '/api',
									Router: APIRouter,
									use: [
										{
											prefix: '/test',
											Router: TestRouter
										}
									]
								})
							]
						})
					}
				])
			]
		}, ({ Web }) => {
			const server = Web.Http.createServer(Web.Application('Testing')).listen();

			http.request(`http://127.0.0.1:${server.address().port}/api`, res => {
				assert.equal(res.statusCode, 201);
				http.request(`http://127.0.0.1:${server.address().port}/api/test`, res => {
					assert.equal(res.statusCode, 202);
					server.close();
					done();
				}).end();
			}).end();
		});
	});
});