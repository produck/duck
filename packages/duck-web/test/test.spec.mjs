import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';
import * as DuckWeb from '../src/index.mjs';

describe.only('DuckWeb', function () {
	it('should create component by default.', function () {
		DuckWeb.Component();
	});

	it('should create component by specific list.', function () {
		DuckWeb.Component([
			{ id: 'Foo', provider: () => {}, description: '' },
		]);
	});

	it('should throw if duplicated application id.', function () {{
		assert.throws(() => {
			DuckWeb.Component([
				{ id: 'Foo', provider: () => {}, description: '' },
				{ id: 'Foo', provider: () => {}, description: '' },
			]);
		}, {
			name: 'TypeError',
			message: 'Invalid "", one "array" expected.\n' +
				'The element at [1] is duplicated.'
		});
	}});

	describe('>Web', function () {
		describe('::register()', function () {
			it('should rigister a custom Application.', function () {
				Duck.define({
					id: 'foo',
					components: [
						DuckWeb.Component()
					]
				}, function ({ Kit }) {
					Kit.Web.register({
						id: 'Foo',
						provider: () => {},
						description: 'Bar'
					});
				})();
			});
		});

		describe('::Application()', function () {
			it('should install a DuckWeb component to a Product.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [
						DuckWeb.Component()
					]
				})();

				const DefaultApplication = Kit.Web.Application('Default');

				assert.ok(typeof DefaultApplication === 'function');
				assert.ok(typeof DefaultApplication() === 'function');
			});
		});

	});

	describe('::Application::Registry', function () {

	});

	describe('::Preset', function () {

	});
});
