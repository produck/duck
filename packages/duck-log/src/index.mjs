import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';
import { defineComponent, defineAny } from '@produck/duck';

import * as Logger from './Logger/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.log',
	name: 'DuckLog',
	version,
	description: 'Creating log channel for recording log message.',
});

const assertCategory = any => Assert.Type.String(any, 'category');

const DuckLogComponent = (options = {}) => {
	const staticLoggerOptionsMap = Options.normalize(options);

	return defineComponent({
		...meta,
		install: ({ Kit }, next) => {
			const map = new Map();

			const register = (category, options = {}) => {
				assertCategory(category);

				if (map.has(category)) {
					return Ow.Error.Common(`The category(${category}) is existed.`);
				}

				map.set(category, new Logger.Handler({ label: category, ...options}));
			};

			Object.freeze(register);

			Kit.Log = new Proxy(register, {
				get: (_target, category) => {
					assertCategory(category);

					if (!map.has(category)) {
						return Ow.Error.Common(`Category logger(${category}) is NOT defined.`);
					}

					return map.get(category).proxy;
				},
			});

			for (const category in staticLoggerOptionsMap) {
				register(category, staticLoggerOptionsMap[category]);
			}

			next();
		},
	});
};

export { Options, defineAny as defineTranscriber };
export { DuckLogComponent as Component };
export { MODIFIER } from './Logger/index.mjs';
