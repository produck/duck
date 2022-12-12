import { Normalizer, P, PROPERTY, S } from '@produck/mold';

export const OptionSchema = S.Object({
	name: P.String(),
	alias: P.String(),
	description: P.OrNull(P.String(), false),
	value: P.OrNull(P.String(), false)
});

export const ArgumentSchema = S.Object({
	name: P.String(),
	required: P.Boolean(false),
	variadic: P.Boolean(false),
});

export const Schema = S.Object({
	name: P.String(),
	description: P.String(''),
	aliases: S.Array({ items: P.String(), key: _ => _ }),
	options: S.Object({ [PROPERTY]: OptionSchema }),
	arguments: S.Array({ items: ArgumentSchema, key: _ => _.name }),
	handler: P.Function(() => {}),
});

export const normalize = Normalizer(Schema);
