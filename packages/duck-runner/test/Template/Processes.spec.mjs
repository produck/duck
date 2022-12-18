import assert from 'node:assert';
import cluster from 'node:cluster';
import * as Duck from '@produck/duck';
import * as DuckRunner from '../../src/index.mjs';

const flag = [];

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

const Mock = Duck.define({
	id: 'foo',
	components: [
		DuckRunner.Component({
			modes: {
				processes: DuckRunner.Template.Processes(),
			},
			roles: {
				a: Kit => {
					Kit.Bus.emit('a');
					console.log(process.pid, 'aaaaaaaaaaa');
				},
				b: Kit => {
					Kit.Bus.emit('b');
					console.log(process.pid, 'bbbbbbbbbbbbb');
				},
			},
		}),
	],
}, async ({ Runner, Bus }) => {
	Runner.start('processes');

	if (cluster.isPrimary) {
		Bus.on('a', () => {
			flag.push(true);
		});

		Bus.on('b', () => {
			flag.push(true);
		});
	}
});

if (cluster.isPrimary) {
	describe('DuckRunner::Template::Processes', function () {
		it('should run.', async function () {
			await Mock();
			await sleep(3000);
			assert.ok(flag.length >= 2);
		});
	});

	after(() => setTimeout(() => process.exit(0), 1000));
	setTimeout(() => run(), 1000);
} else {
	await Mock();
	await sleep(1000);
	process.exit(0);
}
