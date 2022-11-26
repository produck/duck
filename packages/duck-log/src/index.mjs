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

			for (const categoryName in staticLoggerOptionsMap) {
				registry.register(categoryName, staticLoggerOptionsMap[categoryName]);
			}

			Kit.Log = registry.proxy;
		},
	});
};

export const defineTranscriber = any => any;

export { Options };
export { DuckLogProvider as Provider };
