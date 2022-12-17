import { defineComponent, defineAny } from '@produck/duck';
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

const DuckRunnerComponent = (...args) => {
	const { modes, roles } = Options.normalize(...args);

	return defineComponent({
		...meta,
		install: Kit => {
			const RunnerKit = Kit('DuckRunner');
			const manager = new Runner.Manager(RunnerKit);

			const start = async (mode) => {
				if (!T.Native.String(mode)) {
					U.throwError('mode', 'string');
				}

				return await manager.run(mode, RunnerKit);
			};

			for (const name in modes) {
				manager.Mode(name, modes[name]);
			}

			for (const name in roles) {
				manager.Role(name, roles[name]);
			}

			Kit.Runner = Object.freeze({ start });
		},
	});
};

export * as Template from './Template/index.mjs';

export {
	DuckRunnerComponent as Component,
	defineAny as defineExecute,
	defineAny as definePlay,
};
