import { Normalizer, P, PROPERTY, S } from '@produck/mold';

const CommandFeatureOptionSchema = S.Object({
	name: P.String(),
	alias: P.String(),
	description: P.OrNull(P.String(), false),
	value: P.OrNull(P.String(), false)
});

const CommandFeatureArgumentSchema = S.Object({
	name: P.String(),
	required: P.Boolean(false),
	variadic: P.Boolean(false),
});

const CommandFeatureSchema = S.Object({
	name: P.String(),
	description: P.String(''),
	alias: S.Array({ items: P.String(), key: _ => _ }),
	options: S.Object({ [PROPERTY]: CommandFeatureOptionSchema }),
	arguments: S.Array({ items: CommandFeatureArgumentSchema, key: _ => _.name }),
	handler: P.Function(() => {}),
});

export const normalize = Normalizer(CommandFeatureSchema);
export { CommandFeatureSchema as Schema };
