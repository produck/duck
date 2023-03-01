import EventEmitter from 'node:events';
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
			const Bus = new EventEmitter();
			const manager = new Runner.Manager();

			Kit.Bus = Bus;

			const start = async (mode) => {
				if (!T.Native.String(mode)) {
					U.throwError('mode', 'string');
				}

				return await manager.run(mode, Kit);
			};

			for (const name in modes) {
				manager.Mode(name, modes[name]);
			}

			for (const name in roles) {
				const RoleKit = Kit(`Role<${name}>`);

				RoleKit.Acting = Object.freeze({ name });

				const play = roles[name](RoleKit);

				if (!T.Native.Function(play)) {
					U.throwError('play <= role()', 'function <= role()');
				}

				manager.Role(name, play);
			}

			Kit.Runner = Object.freeze({ start });
		},
	});
};

export * as Template from './Template/index.mjs';

export {
	Options,
	DuckRunnerComponent as Component,
	defineAny as defineExecute,
	defineAny as definePlay,
};
