'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = function ProduckWorkspace() {
	return {
		id: 'org.produck.workspace',
		name: 'Workspace',
		install(injection) {
			const workspace = {
				root: path.resolve(),
				map: {}
			};

			const Method = {
				async buildAll() {
					await Method.buildRoot();

					for(const name in workspace.map) {
						await Method.build(name);
					}
				},
				async buildRoot() {
					return fs.ensureDir(workspace.root);
				},
				async build(name, pathname = '') {
					return fs.ensureDir(Method.resolve(name, pathname));
				},
				set root(pathname) {
					workspace.root = path.resolve(pathname);
				},
				get root() {
					return workspace.root;
				},
				setPath(name, pathname, fromRoot = true) {
					if (fromRoot) {
						workspace.map[name] = path.join(workspace.root, pathname);
					} else {
						workspace.map[name] = path.resolve(pathname);
					}
				},
				getPath(name) {
					const pathname = workspace.map[name];

					if (!pathname) {
						throw new Error(`The path named ${name} is NOT existed.`);
					}

					return pathname;
				},
				resolve(name, pathname = '') {
					return path.join(Method.getPath(name), pathname);
				}
			};

			injection.Workspace = Method;
		}
	};
};
