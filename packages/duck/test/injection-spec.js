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

		it('should with name', function () {
			Injection({ foo: 'bar' }, 'test');
		});
	});
	
	describe('$create()', function () {
		it('should created a child injetion successfully.', function () {
			const root = Injection();

			root.$create();
		});

		it('should prototype chain.', function () {
			const root = Injection({ a: 1 });
			const child0 = root.$create({ b: 2 });
			const child1 = child0.$create({ c: 3 });

			assert.equal(child1.a, 1);
			assert.equal(child1.b, 2);
			assert.equal(child1.c, 3);
			assert.throws(() => child1.d);
			root.d = 4;
			assert.equal(child1.d, 4);
			child0.a = 5;
			assert.equal(child1.a, 5);
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