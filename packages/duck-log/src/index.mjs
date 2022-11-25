import { defineComponent } from '@produck/duck';

import * as Logger from './Logger/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = {
	id: 'org.produck.duck.log',
	name: 'DuckLog',
	version,
	description: 'Creating log channel for recording log message.'
};

const DuckLogProvider = options => {
	const staticLoggerOptionsMap = Options.normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const registry = {};

			const register = (categoryName, options) => {
				const existed = registry[categoryName];

				if (existed) {
					throw new Error(`The category logger(${categoryName}) is existed.`);
				}

				registry[categoryName] = Logger.Proxy(options);
			};

			const LogProxy = new Proxy(register, {
				get(categoryName) {
					const categoryLogger = registry[categoryName];

					if (!categoryLogger) {
						throw new Error(`Category logger(${categoryName}) is NOT defined.`);
					}

					return categoryLogger;
				},
				set() {
					throw new Error('Illegal setting property.');
				}
			});

			for (const categoryName in staticLoggerOptionsMap) {
				register(categoryName, staticLoggerOptionsMap[categoryName]);
			}

			Kit.Log = LogProxy;
		},
	});
};

export { Options };
export { DuckLogProvider as Provider };