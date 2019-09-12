'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
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
		it('should be registed as a applications successfully..', function () {
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
			});
		});

		describe('factory::', function () {
			it('should access app, injection, context when factory().', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((app, context, { injection }, options) => {
									assert(app);
									assert(injection.product);
									assert(context);
									assert(Object.isFrozen(injection));
									assert.deepEqual(options, { a: 1 });
									done();
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp', { a: 1 });
				});
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
					const server = Web.Http.createServer(demo).listen();
	
					http.request(`http://127.0.0.1:${server.address().port}`, res => {
						assert.equal(res.statusCode, 200);
						server.close();
						done();
					}).end();
				});
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
					const server = Web.Http.createServer(demo).listen();
	
					http.request(`http://127.0.0.1:${server.address().port}`, res => {
						assert.equal(res.statusCode, 400);
						server.close();
						done();
					}).end();
				});
			});
		});

		describe('plugins::', function () {
			it('should be that injection, context can be access in plugin install.', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((_app, context) => {
									assert.equal(context.foo, 'bar');
									done();
								}, {
									plugins: [
										function install(context, injection) {
											context.foo = 'bar';
											assert(injection.product);
										}
									]
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp');
				});
			});
			
			it('should be that injection, context can be access in `options.installed`.', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((_app, context) => {
									assert.equal(context.a, 'b');
									done();
								}, {
									installed(context, injection) {
										context.a = 'b';
										assert(injection);
									}
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp');
				});
			});
		});
	});
});