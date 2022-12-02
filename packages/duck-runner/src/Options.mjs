import { Custom, Normalizer, P, PROPERTY, S, T } from '@produck/mold';

const mixinName = (_value, _empty, next) => {
	if (T.Helper.PlainObjectLike(_value)) {
		for (const name in _value) {
			_value[name].name = name;
		}
	}

	return next();
};

const DuckRunnerOptionsSchema = S.Object({
	/**
	 * All modes.
	 */
	modes: Custom(S.Object({
		[PROPERTY]: S.Object({
			name: P.String(),
			execute: P.Function()
		})
	}), mixinName),
	/**
	 * All roles.
	 */
	roles: Custom(S.Object({
		[PROPERTY]: S.Object({
			name: P.String(),
			play: P.Function()
		})
	}), mixinName)
});

export const normalize = Normalizer(DuckRunnerOptionsSchema);
export { DuckRunnerOptionsSchema as Schema };
