'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaAcl = require('../');

const aclOptions = {
	asserts: [
		function hasToken(ctx) {
			return Boolean(ctx.query.token);
		}
	],
	table: {
		'duck.test': [1]
	}
};

describe('DuckWebKoaAcl::', function () {
	it('debug', function (done) {
		Duck({
			id: 'test',
			components: [
				DuckWeb([
					{
						id: 'Testing',
						Application: DuckWebKoa((app, { AccessControl, product }) => {
							app.use(AccessControl('duck.test')).use(ctx => {
								ctx.body = product.meta;
							});
						}, {

							plugins: [
								DuckWebKoaAcl(aclOptions)
							]
						})
					}
				])
			]
		}, ({ Web }) => {
			const server = Web.Http.createServer(Web.Application('Testing')).listen();

			http.request(`http://127.0.0.1:${server.address().port}`, res => {
				assert.equal(res.statusCode, 403);
				http.request(`http://127.0.0.1:${server.address().port}/?token=1`, res => {
					assert.equal(res.statusCode, 200);
					server.close();
					done();
				}).end();
			}).end();

		});
	});
});