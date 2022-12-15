import { Custom, Normalizer, PROPERTY, S } from '@produck/mold';

import * as Logger from './Logger/index.mjs';

const DuckLogOptionsSchema = Custom(S.Object({
	[PROPERTY]: Logger.Options.Schema,
}), (_value, _empty, next) => {
	for (const key in _value) {
		if (_value[key].label === undefined) {
			_value[key].label = key;
		}
	}

	return next();
});

export const normalize = Normalizer(DuckLogOptionsSchema);
export { DuckLogOptionsSchema as Schema };
