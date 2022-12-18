import { T, U } from '@produck/mold';
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

const assertCategory = any => {
	if (!T.Native.String(any)) {
		U.throwError('category', 'string');
	}
};

const DuckLogComponent = (options = {}) => {
	const staticLoggerOptionsMap = Options.normalize(options);

	return defineComponent({
		...meta,
		install: Kit => {
			const map = new Map();

			const register = (category, options) => {
				assertCategory(category);

				if (map.has(category)) {
					throw new Error(`The category(${category}) is existed.`);
				}

				map.set(category, new Logger.Handler(options));
			};

			for (const category in staticLoggerOptionsMap) {
				register(category, staticLoggerOptionsMap[category]);
			}

			Kit.Log = new Proxy(Object.freeze(register), {
				get: (_target, category) => {
					assertCategory(category);

					if (!map.has(category)) {
						throw new Error(`Category logger(${category}) is NOT defined.`);
					}

					return map.get(category).proxy;
				},
			});
		},
	});
};

export { Options, defineAny as defineTranscriber };
export { DuckLogComponent as Component };
export { MODIFIER } from './Logger/index.mjs';
