import assert from 'node:assert/strict';
import http from 'node:http';
import { describe, it } from 'mocha';

import * as Duck from '@produck/duck';

import * as DuckWeb from '../src/index.mjs';

describe('DuckWeb', function () {
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
				'The element at [1] is duplicated.',
		});
	}});

	describe('>Web', function () {
		describe('::register()', function () {
			it('should rigister a custom Application.', function () {
				Duck.define({
					id: 'foo',
					components: [
						DuckWeb.Component([]),
					],
				}, function ({ Kit }) {
					Kit.Web.register({
						id: 'Foo',
						provider: () => () => {},
						description: 'Bar',
					});
				})();
			});

			it('should throw if duplicated id.', function () {
				assert.throws(() => {
					Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					}, function ({ Kit }) {
						Kit.Web.register({
							id: 'Default',
							provider: () => () => {},
							description: 'Bar',
						});
					})();
				}, {
					name: 'Error',
					message: 'Duplicate Application(Default).',
				});
			});

			it('should throw if bad Application is returned.', function () {
				assert.throws(() => {
					Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					}, function ({ Kit }) {
						Kit.Web.register({
							id: 'Foo',
							provider: () => {},
							description: 'Bar',
						});
					})();
				}, {
					name: 'TypeError',
					message: 'Invalid ".provider()=>", one "function" expected.',
				});
			});
		});

		describe('::Application()', function () {
			it('should install a DuckWeb component to a Product.', function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckWeb.Component()],
				})();

				const DefaultApplication = Kit.Web.Application('Default');

				assert.ok(typeof DefaultApplication === 'function');
			});

			it('should throw if bad id.', function () {
				assert.throws(() => {
					const Kit = Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					})();

					Kit.Web.Application(1);
				}, {
					name: 'TypeError',
					message: 'Invalid "id", one "string" expected.',
				});
			});

			it('should throw if not found.', function () {
				assert.throws(() => {
					const Kit = Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					})();

					Kit.Web.Application('Foo');
				}, {
					name: 'Error',
					message: 'No application(Foo) existed.',
				});
			});

			it('should throw if bad request listener.', function () {
				assert.throws(() => {
					const Kit = Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component([
								{
									id: 'Foo',
									provider: () => () => {},
									description: 'Bar',
								},
							]),
						],
					})();

					Kit.Web.Application('Foo');
				}, {
					name: 'TypeError',
					message: 'Invalid "Application(Foo)=>", one "(req, res) => any" expected.',
				});

			});
		});
	});

	describe('::Preset', function () {
		describe('::Default()', function () {
			it('should request the product meta data.', async function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [DuckWeb.Component()],
				})();

				const listener = Kit.Web.App('Default');
				const server = http.createServer(listener).listen(8080, '127.0.0.2');
				const response = await fetch('http://127.0.0.2:8080/');

				assert.equal(response.headers.get('Content-Type'), 'application/json');
				assert.equal(response.status, 200);

				const json = await response.json();

				assert.deepEqual(json, {
					meta: {
						id: 'foo',
						name: 'Default Product Name',
						version: '0.0.0',
						description: 'No descrition',
					},
					components: [{
						id: 'org.produck.duck.web',
						name: 'DuckWeb',
						version: json.components[0].version,
						description: 'For creating and managing multiple application providers.',
					}],
				});

				server.close();
			});
		});

		describe('::RedirectHttps', function () {
			it('should respond 302', async function () {
				const Kit = Duck.define({
					id: 'foo',
					components: [
						DuckWeb.Component([{
							id: 'Redirect',
							provider: DuckWeb.Preset.RedirectHttps,
						}]),
					],
				})();

				const listener = Kit.Web.App('Redirect');
				const server = http.createServer(listener).listen(8080, '127.0.0.2');

				const response = await fetch('http://127.0.0.2:8080/', {
					redirect: 'manual',
				});

				assert.equal(response.status, 302);
				assert.equal(response.headers.get('Location'), 'https://127.0.0.2:8080/');

				server.close();
			});
		});
	});
});
