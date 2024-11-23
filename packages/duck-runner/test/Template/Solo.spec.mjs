import assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Duck from '@produck/duck';
import * as DuckRunner from '../../src/index.mjs';

describe('DuckRunner::Template::Solo', function () {
	it('should run.', async function () {
		const flag = [];

		const Kit = Duck.define({
			id: 'foo',
			components: [
				DuckRunner.Component({
					modes: {
						solo: DuckRunner.Template.Solo(),
					},
					roles: {
						a: Kit => () => {
							flag.push(true);
							Kit.Bus.on('b', () => flag.push(null));
						},
						b: Kit => () => {
							flag.push(true);
							Kit.Bus.emit('b');
						},
					},
				}),
			],
		})();

		await Kit.Runner.start('solo');
		await new Promise(resolve => setTimeout(resolve, 1000));
		assert.deepEqual(flag, [true, true, null]);
	});
});
