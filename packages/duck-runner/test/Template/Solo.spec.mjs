import assert from 'node:assert/strict';
import * as Duck from '@produck/duck';
import * as DuckRunner from '../../src/index.mjs';

describe('DuckRunner::Template::Solo', function () {
	it('should run.', async function () {
		const flag = [];

		await Duck.define({
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
		}, async ({ Runner }) => {
			Runner.ready();
			Runner.start('solo');
			await new Promise(resolve => setTimeout(resolve, 1000));
			assert.deepEqual(flag, [true, true, null]);
		})();
	});
});
