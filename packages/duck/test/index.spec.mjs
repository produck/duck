import assert from 'node:assert/strict';
import * as Duck from '../src/index.mjs';

describe('Duck', function () {
	describe('::defineAny()', function () {
		it('should return the 1st arg. defineAny()', function () {
			const obj = {};

			assert.equal(Duck.defineAny(obj), obj);
		});

		it('should return the 1st arg. defineComponent()', function () {
			const obj = {};

			assert.equal(Duck.defineComponent(obj), obj);
		});
	});

	describe('::Provider()', function () {
		it('should define a simple Product.', function () {
			Duck.define({ id: 'org.example.test' });
		});

		it('should define with full options.', function () {
			Duck.define({
				id: 'org.example.test',
				name: 'Test',
				version: '1.0.0',
				description: 'test',
				components: []
			}, function Test() {

			});
		});

		it('should throw if bad assembler.', function () {
			assert.throws(() => Duck.define({ id: 'org.example.test' }, null), {
				name: 'TypeError',
				message: 'Invalid "assembler", one "function" expected.'
			});
		});

		describe('>Component', function () {
			it('should define with a component.', function () {
				Duck.define({
					id: 'org.example.test',
					components: [{
						id: 'org.example.foo',
						name: 'bar',
					}]
				});
			});

			it('should throw if duplicated component id.', function () {
				assert.throws(() => {
					Duck.define({
						id: 'org.example.test',
						components: [{
							id: 'org.example.foo',
							name: 'bar',
						}, {
							id: 'org.example.foo',
							name: 'bar',
						}]
					});
				}, {
					name: 'TypeError',
					message: 'Invalid ".components", one "array" expected.\n' +
						'The element at [1] is duplicated.'
				});
			});
		});

		describe('::Product', function () {
			it('should create a product in default.', function () {
				const Kit = Duck.define({ id: 'org.example.test' })();

				assert.deepEqual(Kit.product, {
					meta: {
						id: 'org.example.test',
						name: 'Default Product Name',
						version: '0.0.0',
						description: 'No descrition',
					},
					components: []
				});
			});

			it('should create a product in full.', function () {
				const Kit = Duck.define({
					id: 'org.example.test',
					name: 'Test',
					version: '1.0.0',
					description: 'test',
					components: []
				})();

				assert.deepEqual(Kit.product, {
					meta: {
						id: 'org.example.test',
						name: 'Test',
						version: '1.0.0',
						description: 'test',
					},
					components: []
				});
			});

			it('should get 2 different installed kit.', function () {
				const Test = Duck.define({ id: 'org.example.test' });
				const KitA = Test();
				const KitB = Test();

				assert.ok(KitA !== KitB);
			});

			it('should has same Kit.product', function () {
				const Test = Duck.define({ id: 'org.example.test' });
				const KitA = Test();
				const KitB = Test();

				assert.ok(KitA.product === KitB.product);
			});

			describe('>Component', function () {
				it('should create a product with 1 component.', function () {
					let InstalledKit;

					const Kit = Duck.define({
						id: 'org.example.test',
						components: [{
							id: 'org.example.foo',
							name: 'bar',
							install: (Kit) => InstalledKit = Kit,
						}]
					})();

					assert.ok(Kit === InstalledKit);

					assert.deepEqual(Kit.product, {
						meta: {
							id: 'org.example.test',
							name: 'Default Product Name',
							version: '0.0.0',
							description: 'No descrition',
						},
						components: [{
							id: 'org.example.foo',
							name: 'bar',
							version: '0.0.0',
							description: 'No descrition',
						}]
					});
				});

				it('should pass params from a Product().', function () {
					const params = [true, null, 1, new Date()];
					let passed;

					Duck.define({ id: 'org' }, (_, ...args) => passed = args)(...params);
					assert.deepEqual(passed, params);
				});
			});
		});
	});
});
