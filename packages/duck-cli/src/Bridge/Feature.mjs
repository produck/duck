import { Cust, Normalizer, P, S, T } from '@produck/mold';

export const OptionSchema = S.Object({
	name: P.StringLength(2)(),
	alias: P.OrNull(P.StringPattern(/^[A-Za-z]$/, 'single letter')(), false),
	description: P.OrNull(P.String(), false),
	value: P.OrNull(P.String(), false),
});

export const OptionsSchema = Cust(S.Array({
	items: OptionSchema,
	key: _ => _.name,
}), (_value, _empty, next) => {
	const optionList = next();
	const used = {};

	optionList.forEach((option, index) => {
		const { alias } = option;

		if (T.Native.String(alias)) {
			if (used[alias] === true) {
				throw new Error(`Duplicated option alias(${alias}), at ${index}.`);
			}

			used[alias] = true;
		}
	});

	return optionList;
});

export const ArgumentSchema = S.Object({
	name: P.String(),
	required: P.Boolean(false),
	variadic: P.Boolean(false),
});

export const ArgumentsSchema = S.Array({ items: ArgumentSchema });

export const AliasesSchema = S.Array({ items: P.String(), key: _ => _ });

export const Schema = S.Object({
	name: P.String(),
	description: P.String(''),
	aliases: AliasesSchema,
	options: OptionsSchema,
	arguments: ArgumentsSchema,
	handler: P.Function(() => {}),
});

export const normalize = Normalizer(Schema);
