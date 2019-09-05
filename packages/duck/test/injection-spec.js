'use strict';

const assert = require('assert');
const Injection = require('../src/Injection');

describe('Injection::', function () {
	describe('constructor()', function () {
		it('should create a injection successfully without initObject.', function () {
			const injection = Injection();

			assert.equal(injection, injection.injection);
		});

		it('should create a injection successfully with initObject.', function () {
			Injection({ foo: 'bar' });
		});

		it('should throw error if initObject provided but not a object.', function () {
			assert.throws(() => {
				Injection(1);
			}, {
				message: '`initObject` MUST be an object.'
			});
		});
	});

	describe('proxy::', function () {

		beforeEach(function () {
			this.injection = Injection({
				dependenceA: { a: true },
				dependenceB: { b: true }
			});
		});

		describe('get::', function () {
			it('should get a existed dependence', function () {
				assert.deepEqual(this.injection.dependenceA, { a: true });
				assert.deepEqual(this.injection.dependenceB, { b: true });
			});

			it('should throw error when access a dependence not existed.', function () {
				assert.throws(() => {
					this.injection.notExisted;
				}, {
					message: 'The dependence named \'notExisted\' is NOT defined.'
				});
			});
		});

		describe('set::', function () {
			it('should set a new dependence successfully.', function () {
				this.injection.dependenceC = { c: true };
			});

			it('should throw error when set an existed dependence.', function () {
				assert.throws(() => {
					this.injection.dependenceA = { a: true };
				}, {
					message: 'The dependence named \'dependenceA\' has been defined.'
				});
			});

			it('should throw error when key is a symbol.', function () {
				assert.throws(() => {
					this.injection[Symbol()] = {};
				}, {
					message: 'The dependence key in injection can NOT be a symbol.'
				});
			});
		});
	});
});