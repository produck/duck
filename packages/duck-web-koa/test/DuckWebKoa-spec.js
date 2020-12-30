'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckWebKoa = require('..');

describe('DuckWebKoa::', function () {
	describe('contrustor()', function () {
		it('should be created with no arguments.', function () {
			DuckWebKoa();
		});

		it('should be created with only factory.', function () {
			DuckWebKoa(() => {});
		});

		it('should be created with factory & options.', function () {
			DuckWebKoa(() => {}, {});
			DuckWebKoa(() => {}, {
				plugins: []
			});
			DuckWebKoa(() => {}, {
				plugins: [],
				installed() {}
			});
		});

		it('should throw error with invalid factory or plugins', function () {
			assert.throws(() => DuckWebKoa(1), {
				message: 'Argument 0 `factory` MUST be a function.'
			});
			assert.throws(() => DuckWebKoa(() => {}, 2));
			assert.throws(() => DuckWebKoa(() => {}, [1]));
			assert.throws(() => DuckWebKoa(() => {}, {
				plugins: [1]
			}));
		});
	});

	describe('With DuckWeb', function () {
		it('should be registed as a applications successfully..', function (done) {
			Duck({
				id: 'com.orchange.DuckWebKoa.test',
				components: [
					DuckWeb([
						{
							id: 'DuckKoaApp',
							Application: DuckWebKoa()
						}
					])
				]
			}, ({ Web }) => {
				Web.Application('DuckKoaApp');
				done();
			})();
		});

		describe('factory::', function () {
			it('should access app, injection when factory().', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((app, { injection }, options) => {
									assert(app);
									assert(injection.product);
									assert.deepEqual(options, { a: 1 });
									done();
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp', { a: 1 });
				})();
			});

			it('should respond successfully by default factory().', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa()
							}
						])
					]
				}, ({ Web }) => {
					const demo = Web.Application('DuckKoaApp');
					const server = http.createServer(demo).listen();

					http.request(`http://127.0.0.1:${server.address().port}`, res => {
						assert.equal(res.statusCode, 200);
						server.close();
						done();
					}).end();
				})();
			});

			it('should respond successfully by with assigned factory().', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((app) => {
									app.use(ctx => {
										ctx.throw(400);
									});
								})
							}
						])
					]
				}, ({ Web }) => {
					const demo = Web.Application('DuckKoaApp');
					const server = http.createServer(demo).listen();

					http.request(`http://127.0.0.1:${server.address().port}`, res => {
						assert.equal(res.statusCode, 400);
						server.close();
						done();
					}).end();
				})();
			});
		});

		describe('plugins::', function () {
			it('should be that injection can be access in plugin install.', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((_app, injection) => {
									assert.equal(injection.foo, 'bar');
									done();
								}, {
									plugins: [
										function install(injection) {
											injection.foo = 'bar';
											assert(injection.product);
										}
									]
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp');
				})();
			});
		});
	});
});