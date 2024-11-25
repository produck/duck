import EventEmitter from 'node:events';
import { Assert } from '@produck/idiom';
import { defineComponent, defineAny, Utils } from '@produck/duck';

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
		install: ({ Kit }, next) => {
			const manager = new Runner.Manager();
			const runner = Kit.Runner = { start: Utils.throwNotInstalled };

			Kit.Bus = new EventEmitter();

			for (const name in modes) {
				manager.Mode(name, modes[name]);
			}

			next();

			for (const name in roles) {
				const RoleKit = Kit(`Role<${name}>`);

				RoleKit.Acting = Object.freeze({ name });

				const play = roles[name](RoleKit);

				Assert.Type.Function(play, 'play <= role()', 'function <= role()');

				manager.Role(name, play);
			}

			runner.start = async function start(mode) {
				Assert.Type.String(mode, 'mode');
				await manager.run(mode, Kit);
			};

			Object.freeze(runner);
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
