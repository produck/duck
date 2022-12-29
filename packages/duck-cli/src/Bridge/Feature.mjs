import { Cust, Normalizer, P, S, T } from '@produck/mold';

export const OptionSchema = S.Object({
	name: P.StringPattern(/^[a-zA-Z0-9][A-Za-z0-9-]*/)(),
	alias: P.OrNull(P.StringPattern(/^[A-Za-z]$/, 'single letter')(), false),
	value: P.OrNull(P.String(), false),
	allowBoolean: P.Boolean(false),
	required: P.Boolean(false),
	default: P.OrNull(P.String(), false),
	variadic: P.Boolean(false),
	description: P.OrNull(P.String(), false),
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
	required: P.Boolean(true),
	default: P.OrNull(P.String(), false),
	variadic: P.Boolean(false),
});

export const ArgumentsSchema = Cust(S.Array({
	items: ArgumentSchema,
}), (_v, _e, next) => {
	const argumentList = next();
	let required = true;

	for (const [index, argument] of argumentList.entries()) {
		if (!required && argument.required) {
			throw new Error(`The required argument(at ${index}) MUST NOT behind a optional one.`);
		}

		if (required && !argument.required) {
			required = false;
		}
	}

	return argumentList;
});

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
