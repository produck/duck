import { Custom, Normalizer, PROPERTY, S, T } from '@produck/mold';

import * as Logger from './Logger/index.mjs';

export const Schema = Custom(S.Object({
	[PROPERTY]: Logger.Options.Schema,
}, 'static logger map'), (_value, _empty, next) => {
	for (const key in _value) {
		const category = _value[key];

		if (!T.Native.Object(category)) {
			continue;
		}

		if (_value[key].label === undefined) {
			_value[key].label = key;
		}
	}

	return next();
});

export const normalize = Normalizer(Schema);
