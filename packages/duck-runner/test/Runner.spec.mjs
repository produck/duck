import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';

import * as Runner from '../src/Runner/index.mjs';

const ProductKit = Duck.define({ id: 'foo' })();

ProductKit.Dep = true;

describe('DuckRunner::Runner', function () {
	describe('::Manager', function () {
		describe('constructor()', function () {
			it('should create a manager.', function () {
				new Runner.Manager();
			});
		});

		describe('.Mode()', function () {
			it('should register a mode.', function () {
				const manager = new Runner.Manager();

				manager.Mode('a', () => {});
			});

			it('should throw if duplicated mode.', function () {
				const manager = new Runner.Manager();

				manager.Mode('a', () => {});

				assert.throws(() => manager.Mode('a', () => {}), {
					name: 'Error',
					message: 'Duplicated mode(a).',
				});
			});
		});

		describe('.Role()', function () {
			it('should register a role.', function () {
				const manager = new Runner.Manager();

				manager.Role('a', () => {});
			});

			it('should throw if duplicated role.', function () {
				const manager = new Runner.Manager();

				manager.Role('a', () => {});

				assert.throws(() => manager.Role('a', () => {}), {
					name: 'Error',
					message: 'Duplicated role(a).',
				});
			});
		});

		describe('.run()', function () {
			it('should throw if non-existed mode.', function () {
				const manager = new Runner.Manager();

				manager.Role('a', () => {});

				assert.rejects(() => manager.run('a', ProductKit('')), {
					name: 'Error',
					message: 'Duplicated role(a).',
				});
			});

			it('should run.', async function () {
				let flag = false;
				const RunnerKit = ProductKit('Runner');
				const manager = new Runner.Manager();

				manager.Mode('a', (Kit) => {
					flag = true;
					assert.equal(Kit.Dep, true);
				});

				await manager.run('a', RunnerKit);
				assert.equal(flag, true);
			});

			it('should run with roles.', async function () {
				let flag = [false, false];
				const RunnerKit = ProductKit('Runner');
				const manager = new Runner.Manager();

				manager.Mode('a', (Kit) => {
					flag[0] = true;
					assert.equal(Kit.Dep, true);
					assert.equal(Kit.Booting.name, 'a');
					Kit.Booting.actors.b();
				});

				manager.Role('b', (Kit) => {
					flag[1] = true;
					assert.equal(Kit.Dep, true);
				});

				await manager.run('a', RunnerKit);
				assert.deepEqual(flag, [true, true]);
			});
		});
	});
});
