import assert from 'node:assert/strict';
import * as Bridge from '../../src/Bridge/index.mjs';

describe('DuckCLI::Bridge::define()', function () {
	it('should create a CustomCommander class.', function () {
		const CustomCommander = Bridge.define({
			name: 'Foo',
			Builder: function Builder() {
				return {
					program: () => {},
					commander: () => {},
					parse: () => {},
				};
			},
		});

		assert.equal(CustomCommander.name, 'FooCommander');
	});

	it('should throw if bad provider.', function () {
		assert.throws(() => {
			Bridge.define({
				name: 'Foo',
				Builder: () => {},
			});
		}, {
			name: 'TypeError',
			message: 'Invalid "", one "builder" expected.',
		});
	});

	describe('::CustomCommander()', function () {

		describe('.buildChildren()', function () {
			it('should children be built.', async function () {
				const flag = [];

				const CustomCommander = Bridge.define({
					name: 'Foo',
					Builder: function Builder() {
						return {
							program: () => {},
							commander: (context) => {
								flag.push(context.parent, context.current);
							},
							parse: () => {},
						};
					},
				});

				const parent = new CustomCommander({ name: 'foo' });
				const child = new CustomCommander({ name: 'bar' });

				parent.appendChild(child);

				const context = new Bridge.Context(null, parent.symbol, parent.feature);

				const builder = {
					program: () => {},
					commander: (context) => {
						flag.push(context.parent, context.current);
					},
					parse: () => {},
				};

				await parent.buildChildren(context, builder);
				assert.deepEqual(flag, [parent.symbol, child.symbol]);
			});
		});

		describe('.build()', function () {
			it('should be built.', async function () {
				const flag = [];

				const CustomCommander = Bridge.define({
					name: 'Foo',
					Builder: function Builder() {
						return {
							program: () => {},
							commander: (context) => {
								flag.push(context.parent, context.current);
							},
							parse: () => {},
						};
					},
				});

				const parent = new CustomCommander({ name: 'foo' });
				const child = new CustomCommander({ name: 'bar' });

				parent.appendChild(child);

				const context = new Bridge.Context(null, Symbol(), { name: 'foo' });

				const builder = {
					program: () => {},
					commander: (context) => {
						flag.push(context.current);
					},
					parse: () => {},
				};

				await parent.build(context, builder);
				assert.deepEqual(flag, [parent.symbol, child.symbol]);
			});
		});

		describe('.parse()', function () {
			it('should be parsed.', async function () {
				const flag = [];

				const CustomCommander = Bridge.define({
					name: 'Foo',
					Builder: function Builder() {
						return {
							program: () => {},
							commander: (context) => {
								flag.push(context.parent, context.current);
							},
							parse: () => {
								flag.push(true);
							},
						};
					},
				});

				const parent = new CustomCommander({ name: 'foo' });
				const child = new CustomCommander({ name: 'bar' });

				parent.appendChild(child);
				await parent.parse([]);
				assert.deepEqual(flag, [parent.symbol, child.symbol, true]);
			});

			it('should throw if bad argv.', async function () {
				const CustomCommander = Bridge.define({
					name: 'Foo',
					Builder: function Builder() {
						return {
							program: () => {},
							commander: () => {},
							parse: () => {},
						};
					},
				});

				const parent = new CustomCommander({ name: 'foo' });
				const child = new CustomCommander({ name: 'bar' });

				parent.appendChild(child);

				await assert.rejects(async () => await parent.parse(), {
					name: 'TypeError',
					message: 'Invalid "", one "string[]" expected.',
				});
			});
		});
	});
});
