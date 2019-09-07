'use strict';

const assert = require('assert');
const Normalizer = require('../src/Normalizer');
const Validator = require('../src/Validator');

describe('Normalizer::', function () {
	describe('constructor()', function () {
		it('should create a normalizer successfully without any arguments.', function () {
			Normalizer();
		});

		it('should create a normalizer successfully only with handler.', function () {
			Normalizer({
				handler(options) {
					return options;
				}
			});
		});

		it('should create a normalizer successfully only with defaults.', function () {
			Normalizer({
				defaults() {
					return { foo: 'bar' };
				}
			});
		});

		it('should create a normalizer successfully only with validate.', function () {
			Normalizer({
				validate() {
					return true;
				}
			});
		});

		it('should throw error if options is invalid.', function () {
			assert.throws(() => Normalizer(0));
			assert.throws(() => Normalizer({ foo: 'bar' }));
			assert.throws(() => Normalizer({ handler: 0 }));
			assert.throws(() => Normalizer({ validate: 0 }));
		});
	});

	describe('normalize()', function () {
		beforeEach(function () {
			this.normalize = Normalizer({
				handler(options) {
					const finalOptions = { id: 'foo', name: 'bar', age: 18 };

					const {
						id: _id = finalOptions.id,
						name: _name = finalOptions.name,
						age: _age = finalOptions.age
					} = options;

					finalOptions.id = _id;
					finalOptions.name = _name;
					finalOptions.age = _age;

					return finalOptions;
				},
				defaults() {
					return {};
				},
				validate: Validator({
					type: 'object',
					additionalProperties: false,
					properties: {
						id: { type: 'string' },
						name: { type: 'string' },
						age: { type: 'number' }
					}
				})
			});
		});

		it('should get finalOptions in line with expectations.', function () {
			assert.deepEqual(this.normalize(), { id: 'foo', name: 'bar', age: 18 });
			assert.deepEqual(this.normalize({ id: 'test' }), { id: 'test', name: 'bar', age: 18 });
			assert.deepEqual(this.normalize({ name: 'test', age: 2 }), { id: 'foo', name: 'test', age: 2 });
			assert.deepEqual(this.normalize({ id: 'abc', name: 'test', age: 2 }), { id: 'abc', name: 'test', age: 2 });
		});

		it('should throw error if options invalid.', function () {
			assert.throws(() => this.normalize(1));
			assert.throws(() => this.normalize({ notExisted: false }));
			assert.throws(() => this.normalize({ id: 123 }));
		});
	});
});
