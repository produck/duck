import assert from 'node:assert/strict';
import http from 'node:http';
import supertest from 'supertest';
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
					name: 'Error',
					message: 'The `.provider` MUST return a function as `Application`.',
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
					Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					}, function ({ Kit }) {
						Kit.Web.Application(1);
					})();
				}, {
					name: 'TypeError',
					message: 'Invalid "id", one "string" expected.',
				});
			});

			it('should throw if not found.', function () {
				assert.throws(() => {
					Duck.define({
						id: 'foo',
						components: [
							DuckWeb.Component(),
						],
					}, function ({ Kit }) {
						Kit.Web.Application('Foo');
					})();
				}, {
					name: 'Error',
					message: 'No application(Foo) existed.',
				});
			});

			it('should throw if bad request listener.', function () {
				assert.throws(() => {
					Duck.define({
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
					}, function ({ Kit }) {
						Kit.Web.Application('Foo');
					})();
				}, {
					name: 'Error',
					message: 'Bad Application(Foo), one "(req, res) => any" expected.',
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
				const server = http.createServer(listener).listen(80, '127.0.0.2');
				const client = supertest('http://127.0.0.2');

				await client
					.get('/')
					.expect('Content-Type', 'application/json')
					.expect(200)
					.expect(res => {
						assert.deepEqual(res.body, {
							meta: {
								id: 'foo',
								name: 'Default Product Name',
								version: '0.0.0',
								description: 'No descrition',
							},
							components: [{
								id: 'org.produck.duck.web',
								name: 'DuckWeb',
								version: '1.0.0',
								description: 'For creating and managing multiple application providers.',
							}],
						});
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
							provider: DuckWeb.Preset.Redirect,
						}]),
					],
				})();

				const listener = Kit.Web.App('Redirect');
				const server = http.createServer(listener).listen(80, '127.0.0.2');
				const client = supertest('http://127.0.0.2');

				await client
					.get('/')
					.expect(302)
					.expect('Location', 'https://127.0.0.2/');

				server.close();
			});
		});
	});
});
