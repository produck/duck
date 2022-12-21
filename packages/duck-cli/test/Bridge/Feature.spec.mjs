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
});
