'use strict';

const assert = require('assert');
const DuckWeb = require('../');
const Duck = require('@or-change/duck');
const http = require('http');

describe('DuckWeb::', function () {
	describe('constructor()', function () {
		it('should create successfully without `options`.', function () {
			DuckWeb();
		});

		it('should create successfully with valid `options`.', function () {
			DuckWeb([]);
			DuckWeb([
				{
					id: 'com.orchange.duck.web.test',
					description: 'test',
					Application() {
						return function TestingApplication() {

						};
					}
				}
			]);
			DuckWeb([
				{
					id: 'com.orchange.duck.web.test2',
					Application() {
						return function TestingApplication() {

						};
					}
				}
			]);
		});

		it('should throw errors with bad type `options`.', function () {
			assert.throws(() => DuckWeb({}));
		});

		it('should throw errors with duplicated id in `options`.', function () {
			assert.throws(() => {
				DuckWeb([
					{
						id: 'com.orchange.duck.web.test',
						description: 'test',
						Application() {
							return function TestingApplication() {

							};
						}
					},
					{
						id: 'com.orchange.duck.web.test',
						description: 'test2',
						Application() {
							return function TestingApplication() {

							};
						}
					}
				]);
			});
		});
	});

	describe('Dependence', function () {
		describe('Web::', function () {
			it('should be mixed in injection.', function (done) {
				Duck({
					id: 'test',
					components: [
						DuckWeb()
					]
				}, ({ Web }) => {
					assert(Web);
					assert(Web.Application);
					done();
				})();
			});

			it('should be access a registed after installed.', function (done) {
				Duck({
					id: 'test',
					components: [
						DuckWeb()
					],
				}, ({ Web }) => {
					Web.Application('Default');
					done();
				})();
			});

			it('should throw error if application is NOT existed.', function (done) {
				Duck({
					id: 'test',
					components: [
						DuckWeb()
					],
				}, ({ Web }) => {
					assert.throws(() => Web.Application('NotExisted'), {
						message: 'The application specified with id=\'NotExisted\' does not exist.'
					});

					done();
				})();
			});

			it('should launch a default application server and get expected response.', function (done) {
				Duck({
					id: 'test',
					components: [
						DuckWeb()
					],
				}, ({ Web }) => {
					const server = http.createServer(Web.Application('Default')).listen();
					const port = server.address().port;

					http.request(`http://127.0.0.1:${port}`, res => {
						assert(res.statusCode, 200);
						server.close();
						done();
					}).end();
				})();
			});

			it('should get details of all applications.', function (done) {
				Duck({
					id: 'test',
					components: [
						DuckWeb()
					],
				}, ({ product }) => {
					assert.deepEqual(product.components, [
						{
							id: 'com.oc.duck.web',
							name: 'WebApplication',
							description: 'Used to guide developer to create a web application.',
							details: {
								applications: [
									{
										id: 'Default',
										description: 'Default application example can view `meta`, `components`, `duck` of `product`.'
									}
								]
							}
						}
					]);

					done();
				})();
			});
		});
	});
});