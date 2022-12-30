import { C, Cust, Normalizer, P, S, T } from '@produck/mold';

const DefaultValueSchema = C.Or([
	P.String(),
	P.Boolean(),
	S.Array({ items: P.String() }, null),
	(_value, _empty) => {
		if (_empty) {
			return undefined;
		}
	},
]);

const ValueNameSchema = P.String();

const ValueOptionsSchema = S.Object({
	name: ValueNameSchema,
	/**
	 * true: string | string[]
	 * false: string | string[] | boolean
	 */
	required: P.Boolean(true),
});

const ValueSimpleSchema = Cust(ValueNameSchema, (_v, _e, next) => {
	return ValueOptionsSchema({ name: next() });
});

const ValueSchema = C.Or([ValueOptionsSchema, ValueSimpleSchema]);

export const OptionSchema = Cust(S.Object({
	name: P.StringPattern(/^[a-zA-Z0-9][A-Za-z0-9-]*/)(),
	alias: P.OrNull(P.StringPattern(/^[A-Za-z]$/, 'single letter')(), false),
	value: P.OrNull(ValueSchema, false),
	/**
	 * The option MUST be specified if true.
	 */
	required: P.Boolean(false),
	variadic: P.Boolean(false),
	default: DefaultValueSchema,
	description: P.OrNull(P.String(), false),
}), (_v, _e, next) => {
	const options = next();

	return options;
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
