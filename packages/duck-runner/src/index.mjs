import EventEmitter from 'node:events';
import { defineComponent } from '@produck/duck';
import { T, U } from '@produck/mold';

import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.runner',
	name: 'DuckRunner',
	version,
	description: 'Providing parallel running for product.'
});

const DuckRunnerProvider = options => {
	const { modes, roles } = Options.normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const Bus = new EventEmitter();
			const RunnerKit = Kit('DuckRunner');

			let running = false;

			const boot = (mode) => {
				if (running) {
					throw new Error('It has been running.');
				}

				running = true;

				if (!T.Native.String(mode)) {
					U.throwError('mode', 'string');
				}

				const run = modes[mode];

				if (run === undefined) {
					throw new Error(`Missing mode(${mode}).`);
				}

				const RunningKit = RunnerKit('Running');
				const meta = Object.freeze({ mode });

				RunningKit.Runner.meta = meta;

				run(RunningKit);
			};

			const registry = { modes: {}, roles: {} };

			for (const name in roles) {
				const NAME = `playAsRole${name}`;
				const play = roles[name].play;

				registry.roles[name] = {
					[NAME]: (Kit) => play(Kit(`Running::Role<${name}>`))
				}[NAME];
			}

			for (const name in modes) {
				const NAME = `runInMode${name}`;
				const execute = modes[name].execute;

				registry.modes[name] = {
					[NAME]: (Kit) => {
						const ModeKit = Kit(`Running::Mode<${name}>`);
						const play = execute(ModeKit);

						for (const name in registry.roles) {
							play(name, () => registry.roles[name](ModeKit));
						}
					}
				}[NAME];
			}

			const Role = () => {

			};

			const Mode = () => {

			};

			Kit.Runner = Object.freeze({ boot, Bus, Role, Mode });
		}
	});
};

export { DuckRunnerProvider as Provider };