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
			Injection('test', { foo: 'bar' });
		});

		it('should throw error if initObject provided but not a object.', function () {
			assert.throws(() => {
				Injection('test', 1);
			}, {
				message: 'Injection() `initObject` MUST be an object.'
			});
		});

		it('should with name', function () {
			Injection('test', { foo: 'bar' });
		});

		it('should throw error if name is NOT a string.', function () {
			assert.throws(() => {
				Injection([], { foo: 'bar' });
			}, {
				message: 'Injection() `name` MUST be a string.'
			});
		});
	});

	describe('$create()', function () {
		it('should created a child injetion successfully.', function () {
			const root = Injection();

			root.$create();
		});

		it('should be prototype chain.', function () {
			const root = Injection('base-0', { a: 1 });
			const child0 = root.$create('1', { b: 2 });
			const child1 = child0.$create('2', { c: 3 });

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
			this.injection = Injection('test', {
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
					message: 'The dependence named \'notExisted\' is NOT defined.\n[test]'
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
					message: 'The dependence named \'dependenceA\' has been defined.\n[test]'
				});
			});

			it('should throw error when key is a symbol.', function () {
				assert.throws(() => {
					this.injection[Symbol()] = {};
				}, {
					message: 'The dependence key in injection can NOT be a symbol.\n[test]'
				});
			});
		});

	});

	describe('Error chains stack::', function () {
		it('should [b] --|> [a] when error caught.', function () {
			const a = Injection('a', { a: 1 });
			const b = a.$create('b', { b: 2 });

			assert.throws(() => {
				b.injection.notExisted;
			}, {
				message: 'The dependence named \'notExisted\' is NOT defined.\n[b] --|> [a]'
			});
		});
	});
});