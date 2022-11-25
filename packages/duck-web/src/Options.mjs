import * as Application from './Application/index.mjs';
import { Custom, Normalizer, PROPERTY, S } from '@produck/mold';

const DuckWebOptionsSchema = Custom(S.Object({
	[PROPERTY]: Application.Options.Schema,
}), (_value, _empty, next) => {
	for (const id in _value) {
		_value[id].id = id;
	}

	return next();
});

export const normalize = Normalizer(DuckWebOptionsSchema);
export { DuckWebOptionsSchema as Schema };