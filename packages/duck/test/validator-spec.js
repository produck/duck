'use strict';

const assert = require('assert');
const Validator = require('../src/Validator');

describe('Validator::', function () {
	describe('constructor()', function () {
		it('should create a validator successfully', function () {
			Validator({});
		});

		it('should create a validator successfully with optional ajvModifier', function () {
			Validator({}, ajv => ajv);
		});

		it('should throw error if schema is invalid.', function () {
			assert.throws(() => {
				Validator();
			}, {
				message: 'schema should be object or boolean'
			});
		});

		it('should throw error if `ajvModifier` is NOT a function.', function () {
			assert.throws(() => {
				Validator({}, null);
			}, {
				message: '`ajvModifier` MUST be a function.'
			});
		});
	});

	describe('validate()', function () {
		beforeEach(function () {
			this.validate = Validator({
				type: 'object',
				additionalProperties: false,
				properties: {
					foo: {
						type: 'number'
					}
				}
			});
		});

		it('should pass validate successfully.', function () {
			this.validate({ foo: 0 });
		});
	
		it('should throw error if NOT passed and errors can be caught.', function () {
			assert.throws(() => {
				this.validate({ foo: 'string' });
			});
		});
	});
});