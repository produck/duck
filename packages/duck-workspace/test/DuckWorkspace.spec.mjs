import * as assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'mocha';

import * as Duck from '@produck/duck';
import * as DuckWorkspace from '../src/index.mjs';

describe('DuckWorkspace', function () {
	it('should install a DuckWorkspace to a Product.', function () {
		const Test = Duck.define({
			id: 'foo',
			components: [
				DuckWorkspace.Component(),
			],
		});

		const Kit = Test();

		assert.equal(Kit.Workspace.root, process.cwd());
	});

	it('should set some new named path from static options.', function () {
		const Test = Duck.define({
			id: 'foo',
			components: [
				DuckWorkspace.Component({
					bar: 'baz',
				}),
			],
		});

		const Kit = Test();

		assert.equal(Kit.Workspace.root, process.cwd());
		assert.equal(Kit.Workspace.getPath('bar'), path.resolve('baz'));
	});
});
