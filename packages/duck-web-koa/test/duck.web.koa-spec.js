'use strict';

const assert = require('assert');
const http = require('http');
const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckWebKoa = require('../');

describe('DuckWebKoa::', function () {
	describe('contrustor()', function () {
		it('should be created with no arguments.', function () {
			DuckWebKoa();
		});

		it('should be created with only callback.', function () {
			DuckWebKoa(() => {});
		});

		it('should be created with callback & plugins.', function () {
			DuckWebKoa(() => {}, []);
		});
		
		it('should throw error with invalid callback or plugins', function () {
			assert.throws(() => DuckWebKoa(1), {
				message: 'Argument[0] `callback` MUST be a function.'
			});
			assert.throws(() => DuckWebKoa(() => {}, 2));
			assert.throws(() => DuckWebKoa(() => {}, [1]));
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
			});
		});

		describe('Callback::', function () {
			it('should access app, injection, context when callback().', function (done) {
				Duck({
					id: 'com.orchange.DuckWebKoa.test',
					components: [
						DuckWeb([
							{
								id: 'DuckKoaApp',
								Application: DuckWebKoa((app, context, { injection }) => {
									assert(app);
									assert(injection.product);
									assert(context);
									assert(Object.isFrozen(injection));
									done();
								})
							}
						])
					]
				}, ({ Web }) => {
					Web.Application('DuckKoaApp');
				});
			});
	
			it('should respond successfully by default callback().', function (done) {
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
	
			it('should respond successfully by with assigned callback().', function (done) {
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
								}, [
									function Test(context, injection) {
										context.foo = 'bar';
										assert(injection.product);
									}
								])
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