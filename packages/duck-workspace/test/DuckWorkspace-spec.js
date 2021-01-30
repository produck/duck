'use strict';

const assert = require('assert');
const Duck = require('@produck/duck');
const DuckWorkspace = require('../');
const fs = require('fs');
const path = require('path');

describe('DuckWorkspace::', function () {

	describe('constructor()', function () {
		it('should be creatde successfully', function () {
			DuckWorkspace();
		});
	});

	describe('inject -> duck', function () {
		it('should be injected successfully.', function (done) {
			const example = Duck({
				id: 'example',
				components: [
					DuckWorkspace()
				]
			}, function Example({ Workspace }) {
				Workspace;
				done();

				return {
					Workspace: Workspace
				};
			});

			example();
		});
	});

	describe('Injection', function () {
		this.beforeEach(function (done) {
			const example = Duck({
				id: 'example',
				components: [
					DuckWorkspace()
				]
			}, function Example({ Workspace }) {
				Workspace;
				done();

				return {
					Workspace: Workspace
				};
			});

			this.workspace = example().Workspace;
		});

		describe('#root', function () {
			it('should be being path.resolve()', function () {
				assert.equal(this.workspace.root, path.resolve());
			});
		});


		describe('#root=', function () {
			it('should be an absolute path by path.resolve(...)', function () {
				this.workspace.root = 'foo/bar';
				assert.equal(this.workspace.root, path.resolve('foo/bar'));
			});

			it('should be the specific absolute path.', function () {
				const mockpath = path.resolve('abc');

				this.workspace.root = mockpath;
				assert.equal(this.workspace.root, mockpath);
			});
		});

		describe('setPath()', function () {
			it('should set a new path successfully.', function () {
				this.workspace.setPath('foo', 'bar');
			});

			it('should replace the specific path with a new one.', function () {
				this.workspace.setPath('foo', 'bar');

				const originalPath = this.workspace.getPath('foo');

				assert.equal(originalPath, path.resolve('bar'));
				this.workspace.setPath('foo', 'abc');
				assert.notEqual(originalPath, path.resolve('abc'));
			});

			it('should set a new path not from root successfully', function () {
				this.workspace.root = 'a/b/c';
				this.workspace.setPath('a', 'foo/bar');
				this.workspace.setPath('b', 'foo/bar', false);

				assert.notEqual(this.workspace.getPath('a'), this.workspace.getPath('b'));
			});
		});

		describe('getPath()', function () {
			beforeEach(function () {
				this.workspace.setPath('foo', 'a/b/c');
			});

			it('should get a registed path successfully.', function () {
				const pathname = this.workspace.getPath('foo');

				assert.equal(pathname, path.resolve('a/b/c'));
			});

			it('should throw an error if a named path is not existed.', function () {
				assert.throws(() => {
					this.workspace.getPath('bar');
				});
			});
		});

		describe('resolve()', function () {
			beforeEach(function () {
				this.workspace.setPath('foo', 'a/b/c');
			});

			it('should return a correct named pathname.', function () {
				assert.equal(this.workspace.resolve('foo'), this.workspace.getPath('foo'));
			});

			it('should return a correct named pathname with an appended path.', function () {
				assert.equal(
					this.workspace.resolve('foo', 'd'),
					path.join(this.workspace.getPath('foo'), 'd')
				);
			});

			it('should throw an error if a named path is not existed.', function () {
				assert.throws(() => {
					this.workspace.resolve('bar');
				});

				assert.throws(() => {
					this.workspace.resolve('bar', 'd');
				});
			});
		});

		describe('build()', function () {
			beforeEach(function () {
				this.workspace.root = 'root';
				this.workspace.setPath('foo', 'a/b/c');
			});

			it('should create a directory by a registed pathname successfully.', async function () {
				await this.workspace.build('foo');
				await fs.promises.access(this.workspace.getPath('foo'));
				await fs.promises.rmdir(this.workspace.root, { recursive: true });
			});

			it('should throw an error if a named path is not existed.', async function () {
				await assert.rejects(() => this.workspace.build('bar'));
			});
		});

		describe('buildRoot()', function () {
			beforeEach(function () {
				this.workspace.root = 'root';
				this.workspace.setPath('foo', 'a/b/c');
			});

			it('should create a directory by root path.', async function () {
				await this.workspace.buildRoot();
				await fs.promises.access(this.workspace.root);
				await fs.promises.rmdir(this.workspace.root, { recursive: true });
			});
		});

		describe('buildAll()', function () {
			beforeEach(function () {
				this.workspace.root = 'root';
				this.workspace.setPath('foo', 'a/b/c');
				this.workspace.setPath('bar', 'c/d/e');
			});

			it('should all registered pathname be made in fs.', async function () {
				await this.workspace.buildAll();
				await fs.promises.access(this.workspace.root);
				await fs.promises.access(this.workspace.getPath('foo'));
				await fs.promises.access(this.workspace.getPath('bar'));
				await fs.promises.rmdir(this.workspace.root, { recursive: true });
			});
		});
	});

});