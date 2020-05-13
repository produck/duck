'use strict';

const Duck = require('../');
const assert = require('assert');
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

		it('should throw error if use dumplicated components.', function () {
			assert.throws(() => {
				Duck({
					id: 'com.orchange.duck.test',
					components: [
						{
							id: 'com.orchange.duck.test',
							name: 'TestComponent',
							description: 'test',
							install() {},
						},
						{
							id: 'com.orchange.duck.test',
							name: 'TestComponent',
							description: 'test',
							install() {},
						}
					]
				});
			}, {
				message: 'Dumplicated product component \'com.orchange.duck.test\' defined.'
			});
		});

		describe('assembler::', function () {
			it('should access product.meta to get id.', function (done) {
				Duck({
					id: 'com.orchange.duck.test',
				}, ({ product }, options) => {
					assert.equal(product.meta.id, 'com.orchange.duck.test');
					assert.deepEqual(options, { a: 1 });
					done();
				})({ a: 1 });
			});
		});
	});

	describe('hooks::', function () {
		describe('installed::', function () {
			it('should can append new dependence in options.installed.', function (done) {
				const sample = {};

				Duck({
					id: 'com.orchange.duck.test',
					installed({ injection }) {
						injection.newone = sample;
					}
				}, ({ newone }) => {
					assert.strictEqual(newone, sample);
					done();
				})();
			});
		});
	});

	describe('dependence::', function () {
		describe('(preset)product::', function () {
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
					})();
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
					})();
				});
			});

			describe('#components', function () {
				it('should get [] if no component installed.', function (done) {
					Duck({
						id: 'com.orchange.duck.test',
					}, ({ product }) => {
						assert.deepEqual(product.components, []);
						done();
					})();
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
					})();
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
					})();
				});
			});
		});
	});
});