import * as assert from 'node:assert/strict';
import * as Duck from '@produck/duck';
import * as DuckWorkspace from '../src/index.mjs';

describe('DuckWorkspace', function () {
	it('should install a DuckWorkspace to a Product.', function () {
		const Test = Duck.define({
			id: 'foo',
			components: [
				DuckWorkspace.Component()
			]
		});

		const Kit = Test();

		assert.equal(Kit.Workspace.root, process.cwd());
	});
});
