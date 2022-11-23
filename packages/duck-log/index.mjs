import { defineComponent } from '@produck/duck';
import { Custom, Normalizer, S } from '@produck/mold';

import * as Logger from './src/LoggerProxy.mjs';
import version from './version.mjs';

const DuckLogOptionsSchema = Custom(S.Object(), (_value, _empty, next) => {
	for (const key in value) {
		if (value[key].label === undefined) {
			value[key].label = key;
		}
	}

	const value = next();

	for (const key of value) {
		value[key] = Logger.normalize(value[key]);
	}
});

const normalize = Normalizer(DuckLogOptionsSchema);

const meta = {
	id: 'org.produck.duck.log',
	name: 'DuckLog',
	version,
	description: 'Creating log channel for recording log message.'
};

const DuckLogProvider = options => {
	const staticLoggerOptionsMap = normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const registry = {};

			const register = (categoryName, options) => {
				const existed = registry[categoryName];

				if (existed) {
					throw new Error(`The category named ${categoryName} is existed.`);
				}

				registry[categoryName] = Logger.Proxy(options);
			};

			const LogProxy = new Proxy(register, {
				get(categoryName) {
					const categoryLogger = registry[categoryName];

					if (!categoryLogger) {
						throw new Error(`A logger named "${categoryName}" is NOT defined.`);
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

export { DuckLogProvider as Provider };