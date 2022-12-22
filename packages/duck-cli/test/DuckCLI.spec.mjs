import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';

import * as DuckCLI from '../src/index.mjs';

describe('DuckCLI', function () {
	describe('::Component()', function () {
		it('should create a component.', function () {
			DuckCLI.Component(() => {}, {
				name: 'Foo',
				Builder: () => {
					return {
						program: () => {},
						commander: () => {},
						parse: () => {},
					};
				},
			});
		});

		it('should throw if bad "factory".', function () {
			assert.throws(() => DuckCLI.Component(), {
				name: 'TypeError',
				message: 'Invalid "factory", one "function" expected.',
			});
		});

		it('should throw if bad "provider".', function () {
			assert.throws(() => DuckCLI.Component(() => {}), {
				name: 'TypeError',
				message: 'Invalid "", one "object" expected.',
			});
		});

		it('should throw if bad "provider.builder".', function () {
			assert.throws(() => DuckCLI.Component(() => {}, {
				name: 'Foo',
				Builder: () => {},
			}), {
				name: 'TypeError',
				message: 'Invalid "", one "builder" expected.',
			});
		});
	});

	describe('>CLI', function () {
		it('should install a cli component.', function () {
			const ProductKit = Duck.define({
				id: '',
				components: [
					DuckCLI.Component(({ Commander, setProgram }) => {
						const program = new Commander();

						setProgram(program);
					}, {
						name: 'Foo',
						Builder: () => {
							return {
								program: () => {},
								commander: () => {},
								parse: () => {},
							};
						},
					}),
				],
			})();

			assert.notEqual(ProductKit.CLI, undefined);
		});

		describe('parse()', function () {
			it('should parse an argv.', async function () {
				let flag = false;

				const ProductKit = Duck.define({
					id: '',
					components: [
						DuckCLI.Component(({ Commander, setProgram }) => {
							const program = new Commander({ name: 'foo' });

							setProgram(program);
						}, {
							name: 'Foo',
							Builder: () => {
								return {
									program: () => {},
									commander: () => {},
									parse: () => flag = true,
								};
							},
						}),
					],
				})();

				await ProductKit.CLI.parse([]);
				assert.equal(flag, true);
			});

			it('should throw if set bad program.', async function () {
				const ProductKit = Duck.define({
					id: '',
					components: [
						DuckCLI.Component(({ setProgram }) => {
							setProgram(null);
						}, {
							name: 'Foo',
							Builder: () => {
								return {
									program: () => {},
									commander: () => {},
									parse: () => {},
								};
							},
						}),
					],
				})();

				await assert.rejects(async () => {
					await ProductKit.CLI.parse([]);
				}, {
					name: 'TypeError',
					message: 'Invalid "program", one "commander" expected.',
				});
			});

			it('should throw if no set program', async function () {
				const ProductKit = Duck.define({
					id: '',
					components: [
						DuckCLI.Component(() => {}, {
							name: 'Foo',
							Builder: () => {
								return {
									program: () => {},
									commander: () => {},
									parse: () => {},
								};
							},
						}),
					],
				})();

				await assert.rejects(async () => {
					await ProductKit.CLI.parse([]);
				}, {
					name: 'Error',
					message: 'Program is NOT defined.',
				});
			});
		});
	});
});
