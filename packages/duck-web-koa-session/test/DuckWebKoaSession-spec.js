'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaSession = require('../');

describe('DuckWebKoaSession::', function () {
	it('debug', function (done) {
		Duck({
			id: 'test',
			components: [
				DuckWeb([
					{
						id: 'Testing',
						Application: DuckWebKoa((app, { Session, product }) => {
							Session(app);

							app.use(ctx => {
								if (ctx.state.session.test !== 'true') {
									ctx.state.session.test = 'true';

									return ctx.status = 302;
								}

								ctx.body = product.meta;
							});
						}, {
							plugins: [
								DuckWebKoaSession()
							]
						})
					}
				])
			]
		}, ({ Web }) => {
			const server = http.createServer(Web.Application('Testing')).listen();

			http.request(`http://127.0.0.1:${server.address().port}`, res => {
				assert.equal(res.statusCode, 302);

				const request = http.request(`http://127.0.0.1:${server.address().port}`, res => {
					assert.equal(res.statusCode, 200);
					server.close();
					done();
				});

				request.setHeader('Cookie', res.headers['set-cookie']);
				request.end();
			}).end();
		})();
	});
});