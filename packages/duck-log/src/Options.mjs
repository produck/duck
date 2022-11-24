
import { Custom, Normalizer, S } from '@produck/mold';

import * as Logger from './src/LoggerProxy.mjs';

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

export const normalize = Normalizer(DuckLogOptionsSchema);
export { DuckLogOptionsSchema as Schema };