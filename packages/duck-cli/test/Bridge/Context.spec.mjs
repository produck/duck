import assert from 'node:assert/strict';
import * as Bridge from '../../src/Bridge/index.mjs';

describe('DuckCLI::Bridge::Context', function () {
	describe('constructor()', function () {
		it('should create a Context.', function () {
			const feature = Bridge.Feature.normalize({ name: 'foo' });

			new Bridge.Context(null, Symbol(), feature);
		});
	});

	describe('.proxy', function () {
		it('should get a clone from context.', function () {
			const feature = Bridge.Feature.normalize({ name: 'foo' });
			const context = new Bridge.Context(null, Symbol(), feature);

			assert.deepEqual(context.proxy, {
				parent: null,
				current: context.current,
				feature: Bridge.Feature.normalize({ name: 'foo' }),
			});
		});
	});

	describe('.create()', function () {
		it('should create a child context.', function () {
			const feature = Bridge.Feature.normalize({ name: 'foo' });
			const parent = new Bridge.Context(null, Symbol(), feature);
			const child = parent.create(Symbol(), feature);

			assert.ok(child instanceof Bridge.Context);
		});
	});
});
