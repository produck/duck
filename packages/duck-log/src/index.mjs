import { defineComponent } from '@produck/duck';

import * as Logger from './Logger/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.log',
	name: 'DuckLog',
	version,
	description: 'Creating log channel for recording log message.'
});

const DuckLogProvider = options => {
	const staticLoggerOptionsMap = Options.normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const registry = new Logger.Registry();

			for (const category in staticLoggerOptionsMap) {
				registry.register(category, staticLoggerOptionsMap[category]);
			}

			Kit.Log = new Proxy((...args) => registry.register(...args), {
				get: (_target, category) => {
					if (!registry.has(category)) {
						throw new Error(`Category logger(${category}) is NOT defined.`);
					}

					return registry.get(category);
				},
				set: () => {
					throw new Error('Illegal setting property.');
				}
			});
		},
	});
};

export const defineTranscriber = any => any;

export { Options };
export { DuckLogProvider as Provider };
export { MODIFIER } from './Logger/index.mjs';
