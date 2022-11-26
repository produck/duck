import EventEmitter from 'node:events';
import { defineComponent } from '@produck/duck';

import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.runner',
	name: 'DuckRunner',
	version,
	description: 'Providing parallel running for product.'
});

const DuckRunnerProvider = options => {
	const finalOptions = Options.normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			let running = false;

			const boot = (mode) => {
				if (running) {
					throw new Error('It has been running.');
				}

				running = true;

				const run = finalOptions.modes[mode];

				if (run === undefined) {
					throw new Error(`Missing mode(${mode}).`);
				}

				const RunningKit = RunnerKit('Running');
				const meta = Object.freeze({ mode });

				RunningKit.Runner.meta = meta;

				run(RunningKit);
			};

			const Bus = new EventEmitter();
			const RunnerKit = Kit('DuckRunner');

			Kit.Runner = Object.freeze({ boot, Bus });
		}
	});
};

export { DuckRunnerProvider as Provider };