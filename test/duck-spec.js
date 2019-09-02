'use strict';

const Duck = require('../');
const assert = require('assert');
const EventEmitter = require('events');
const meta = require('../package.json');

describe('Duck::', function () {
	describe('constructor::', function () {
		it('should create a duck successfully', function () {
			Duck({
				id: 'com.orchange.duck.test'
			});
		});

		it('should throw error if lose options.id', function () {
			assert.throws(() => {
				Duck();
			});
		});

		describe('callback::', function () {
			it('should access product.meta to get id.', function (done) {
				Duck({
					id: 'com.orchange.duck.test',
				}, ({ product }) => {
					assert.equal(product.meta.id, 'com.orchange.duck.test');
					done();
				});
			});
		});
	});

	describe('dependence::', function () {
		it('should set a dependence into injection by options.injection directly.', function (done) {
			Duck({
				id: 'com.orchange.duck.test',
				injection: {
					test: true
				}
			}, ({ test }) => {
				assert.strictEqual(test, true);
				done();
			});
		});

		describe('(preset)product::', function () {
			it('should be a event emitter.', function (done) {
				Duck({
					id: 'com.orchange.duck.test',
				}, ({ product }) => {
					assert(product instanceof EventEmitter);
					done();
				});
			});

			describe('#meta', function () {
				it('should get product info correctly.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
						name: 'test',
						namespace: 'test-ns',
						version: '1.1.1',
						description: 'test description',
					}, ({ product }) => {
						assert.deepEqual(product.meta, {
							id: 'com.orchange.duck.test',
							name: 'test',
							namespace: 'test-ns',
							version: '1.1.1',
							description: 'test description',
						});
						done();
					});
				});

				it('should get default product info correctly.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
					}, ({ product }) => {
						assert.deepEqual(product.meta, {
							id: 'com.orchange.duck.test',
							name: 'Default Product Name',
							namespace: '',
							version: '0.0.0',
							description: 'No descrition',
						});
						done();
					});
				});
			});
		
			describe('#components', function () {
				it('should get [] if no component installed.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
					}, ({ product }) => {
						assert.deepEqual(product.components, []);
						done();
					});
				});

				it('should get all info if a component installed.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
						components: [
							{
								id: 'private.luo.test.panda',
								name: 'TeacherLuo',
								description: 'shishi',
								install() {},
								getDetails() {
									return {
										foo: 'bar'
									};
								}
							},
						]
					}, ({ product }) => {
						assert.deepEqual(product.components, [
							{
								id: 'private.luo.test.panda',
								name: 'TeacherLuo',
								description: 'shishi',
								details: {
									foo: 'bar'
								}
							}
						]);
						done();
					});
				});
			});
		
			describe('#duck', function () {
				it('should get current duck packge info.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
					}, ({ product }) => {
						assert.deepEqual(product.duck, {
							version: meta.version,
							peerDependencies: meta.peerDependencies
						});
						done();
					});
				});
			});
		});
	});
});