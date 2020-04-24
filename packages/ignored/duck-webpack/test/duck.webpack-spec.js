'use strict';

const assert = require('assert');
const merge = require('webpack-merge');
const Duck = require('@or-change/duck');
const DuckWebpack = require('../');

describe('DuckWebpack::', function () {
	describe('constructor()', function () {
		it('should create a new duckWebpack successfully without any arguments.', function () {
			DuckWebpack();
		});

		it('should create a new duckWebpack successfully with valid options.', function () {
			DuckWebpack({
				'com.orchange.duck.webpackTest': function () {
					return {};
				}
			});
		});

		it('should throw error if TemplatesOptions is not an invalid', function () {
			assert.throws(() => DuckWebpack([]));
			assert.throws(() => DuckWebpack(1));
			assert.throws(() => DuckWebpack(null));
			assert.throws(() => DuckWebpack({
				'@'() {}
			}));
		});
	});

	describe('Dependence', function () {
		it('should mixed in the injection successfully.', function (done) {
			Duck({
				id: 'test',
				components: [
					DuckWebpack()
				]
			}, ({ Webpack }) => {
				assert(Webpack);
				assert.equal(Webpack.merge, merge);
				done();
			});
		});

		it('should create a defined config object by Webpack.', function (done) {
			Duck({
				id: 'test',
				components: [
					DuckWebpack({
						Test({ Webpack }, entry) {
							assert(Webpack);
							
							return {
								entry: entry,
								node: false
							};
						}
					})
				]
			}, ({ Webpack }) => {
				const config = Webpack('Test', process.cwd());

				assert.deepEqual(config, {
					entry: process.cwd(),
					node: false
				});
				
				done();
			});
		});

		it('should throw error if template is NOT defined.', function (done) {
			Duck({
				id: 'test',
				components: [
					DuckWebpack()
				]
			}, ({ Webpack }) => {
				assert.throws(() => Webpack('Test'), {
					message: 'The webpack template named \'Test\' is NOT defined.'
				});

				done();
			});
		});
		
		it('should that `Webpack` is extensible.', function (done) {
			Duck({
				id: 'test',
				components: [
					DuckWebpack()
				]
			}, ({ Webpack }) => {
				assert.throws(() => Webpack.a = 1);

				done();
			});
		});
	});
});