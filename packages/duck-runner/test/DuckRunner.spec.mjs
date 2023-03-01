import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';

import * as DuckRunner from '../src/index.mjs';

describe('DuckRunner', function () {
	it('should create a ', function () {
		DuckRunner.Component();
	});

	describe('>Runner', function () {
		it('should create runner component with roles & modes.', function () {
			const ProductKit = Duck.define({
				id: '',
				components: [
					DuckRunner.Component({
						modes: { a: () => {} },
						roles: { b: () => () => {} },
					}),
				],
			})();

			assert.notEqual(ProductKit.Runner, undefined);
		});

		it('should throw if bad role.', function () {
			assert.throws(() => {
				Duck.define({
					id: '',
					components: [
						DuckRunner.Component({
							roles: { b: () => {} },
						}),
					],
				})();
			}, {
				name: 'TypeError',
				message: 'Invalid "play <= role()", one "function <= role()" expected.',
			});
		});

		describe('::start()', function () {
			it('should throw if bad mode', async function () {
				const ProductKit = Duck.define({
					id: '',
					components: [
						DuckRunner.Component({
							modes: { a: () => {} },
							roles: { b: () => () => {} },
						}),
					],
				})();

				await assert.rejects(async () => {
					await ProductKit.Runner.start(null);
				}, {
					name: 'TypeError',
					message: 'Invalid "mode", one "string" expected.',
				});
			});

			it('should start ok.', async function () {
				const flag = [false, false];

				const ProductKit = Duck.define({
					id: '',
					components: [
						DuckRunner.Component({
							modes: {
								a: ({ Booting }) => {
									flag[0] = true;
									Booting.actors.b();
								},
							},
							roles: { b: () => () => flag[1] = true },
						}),
					],
				})();

				await ProductKit.Runner.start('a');
				assert.deepEqual(flag, [true, true]);
			});
		});
	});
});
