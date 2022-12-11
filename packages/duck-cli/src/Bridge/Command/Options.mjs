import { Normalizer, P, PROPERTY, S } from '@produck/mold';

const CommandDescriptorSchema = S.Object({
	name: P.String(),
	description: P.String(''),
	alias: S.Array({ items: P.String(), key: _ => _ }),
	options: S.Object({
		[PROPERTY]: S.Object({
			name: P.String(),
			alias: P.String(),
			description: P.OrNull(P.String()),
			value: P.OrNull(P.String(), false)
		})
	}),
	arguments: S.Array({
		items: S.Object({
			name: P.String(),
			required: P.Boolean(false),
			variadic: P.Boolean(false),
		}),
		key: _ => _.name
	}),
	handler: P.Function(() => {}),
});

export const normalize = Normalizer(CommandDescriptorSchema);
export { CommandDescriptorSchema as Schema };
