import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import * as Duck from '@produck/duck';

import * as DuckLog from '../src/index.mjs';

describe('DuckLog', function () {
	it('should create a component by default.', function () {
		DuckLog.Component();
	});

	it('should create with static loggers.', function () {
		DuckLog.Component({ foo: {} });
	});

	it('should throw if bad static logger.', function () {
		assert.throws(() => {
			DuckLog.Component({ foo: 1 });
		}, {
			name: 'TypeError',
			message: 'Invalid ".foo", one "logger descriptor" expected.',
		});
	});

	it('should throw if bad static logger.', function () {
		assert.throws(() => {
			DuckLog.Component({ foo: 1 });
		}, {
			name: 'TypeError',
			message: 'Invalid ".foo", one "logger descriptor" expected.',
		});
	});

	describe('>Log', function () {
		it('should install Log to a Product.', function () {
			const Kit = Duck.define({
				id: 'foo',
				components: [DuckLog.Component()],
			})();

			assert.notEqual(Kit.Log, undefined);
		});

		describe('::register()', function () {
			it('should register a new logger.', async function () {
				await new Promise((resolve) => {
					Duck.define({
						id: 'foo',
						components: [DuckLog.Component()],
					}, function ({ Log }) {
						Log('bar', { label: 'bar' });
						Log('baz');
						resolve();
					})();
				});
			});

			it('should throw if bad category.', async function () {
				await new Promise(resolve => {
					Duck.define({
						id: 'foo',
						components: [DuckLog.Component()],
					}, function ({ Log }) {
						assert.throws(() => Log(1), {
							name: 'TypeError',
							message: 'Invalid "category", one "string" expected.',
						});

						resolve();
					})();
				});

			});

			it('should throw if duplicated category.', async function () {
				await new Promise(resolve => {
					Duck.define({
						id: 'foo',
						components: [DuckLog.Component({ foo: {} })],
					}, function ({ Log }) {
						assert.throws(() => Log('foo'), {
							name: 'Error',
							message: 'The category(foo) is existed.',
						});

						resolve();
					})();
				});
			});

			it('should throw if installed.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckLog.Component({ foo: {} })],
				})();

				assert.throws(() => Kit.Log('foo'), {
					name: 'Error',
					message: 'Can NOT register log category after installed.',
				});
			});
		});

		describe('.<category>', function () {
			it('should get a logger.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckLog.Component({ foo: {} })],
				})();

				assert.ok(Kit.Log.foo !== undefined);
			});

			it('should throw if bad category.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckLog.Component({ foo: {} })],
				})();

				assert.throws(() => Kit.Log[Symbol()], {
					name: 'TypeError',
					message: 'Invalid "category", one "string" expected.',
				});
			});

			it('should throw if non-existed category.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckLog.Component({ foo: {} })],
				})();

				assert.throws(() => Kit.Log.bar, {
					name: 'Error',
					message: 'Category logger(bar) is NOT defined.',
				});
			});
		});
	});
});
