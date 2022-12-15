import { defineComponent, define } from '@produck/duck';
import { T, U } from '@produck/mold';

import * as Runner from './Runner/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.runner',
	name: 'DuckRunner',
	version,
	description: 'Providing parallel running for product.',
});

const DuckRunnerProvider = options => {
	const { modes, roles } = Options.normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const RunnerKit = Kit('DuckRunner');
			const manager = new Runner.Manager(RunnerKit);

			const start = async (mode) => {
				if (!T.Native.String(mode)) {
					U.throwError('mode', 'string');
				}

				return await manager.run(mode);
			};

			for (const name of modes) {
				manager.Mode(name, modes[name]);
			}

			for (const name of roles) {
				manager.Role(name, roles[name]);
			}

			Kit.Runner = Object.freeze({ start });
		},
	});
};

export { DuckRunnerProvider as Provider };
export { define as defineExecute, define as definePlay };
