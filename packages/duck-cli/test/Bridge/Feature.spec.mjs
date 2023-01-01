import assert from 'node:assert/strict';
import * as Bridge from '../../src/Bridge/index.mjs';

describe('DuckCLI::Bridge::Feature', function () {
	it('should throw if duplicated option by name.', function () {
		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [
					{ name: 'version', alias: 'v' },
					{ name: 'version' },
				],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid ".options", one "array" expected.\n' +
				'The element at [1] is duplicated.',
		});
	});

	it('should throw if duplicated option alias.', function () {
		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [
					{ name: 'version', alias: 'v' },
					{ name: 'viewer', alias: 'v' },
				],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid ".options", one "unknown" expected.\n' +
				'Error: Duplicated option alias(v), at 1.',
		});
	});

	it('should throw if required argument behind a optional one', function () {
		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				arguments: [
					{ name: 'version', required: false },
					{ name: 'viewer' },
				],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid ".arguments", one "unknown" expected.\n' +
				'Error: The required argument(at 1) MUST NOT behind a optional one.',
		});
	});

	it('should pass if value=null', function () {
		const feature = Bridge.Feature.normalize({
			name: 'foo',
			options: [
				{
					name: 'bar',
					value: null,
				},
			],
		});

		assert.equal(feature.options[0].value, null);
	});

	it('should pass if a simple value.', function () {
		const feature = Bridge.Feature.normalize({
			name: 'foo',
			options: [
				{
					name: 'bar',
					value: 'baz',
				},
			],
		});

		assert.deepEqual(feature.options[0].value, {
			name: 'baz',
			required: true,
			variadic: false,
			default: null,
		});
	});

	it('should throw if value required but a boolean defaut.', function () {
		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [{
					name: 'bar',
					value:  {
						name: 'baz',
						default: true,
					},
				}],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid ".options[0].value", one "unknown" expected.',
		});
	});

	it('should throw if value required but a boolean defaut.', function () {
		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [{
					name: 'bar',
					value:  {
						name: 'baz',
						default: true,
					},
				}],
			});
		}, {
			name: 'TypeError',
			message: 'Invalid ".options[0].value", one "unknown" expected.',
		});
	});

	it('should throw if value variadic but a string[].', function () {
		const expected = {
			name: 'TypeError',
			message: 'Invalid ".options[0].value", one "unknown" expected.',
		};

		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [{
					name: 'bar',
					value:  { name: 'baz', variadic: true, default: true },
				}],
			});
		}, expected);

		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [{
					name: 'bar',
					value:  { name: 'baz', variadic: true, default: 'qux' },
				}],
			});
		}, expected);
	});

	it('should throw if value not variadic but a string[].', function () {
		const expected = {
			name: 'TypeError',
			message: 'Invalid ".options[0].value", one "unknown" expected.',
		};

		assert.throws(() => {
			Bridge.Feature.normalize({
				name: 'foo',
				options: [{
					name: 'bar', value:  { name: 'baz', default: ['qux'] },
				}],
			});
		}, expected);
	});
});
