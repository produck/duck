import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold';

type Argv = string[];

export namespace Bridge {
	export namespace Feature {
		interface Option {
			name: string;
			alias?: string | null;
			description?: string | null;
			value?: string | null;
		}

		interface Argument {
			name: string;
			required?: boolean;
			variadic?: boolean;
		}

		type Options = Option[];
		type Arguments = Argument[];
		type Aliases = string[];

		interface Object {
			name: string;
			description?: string;
			aliases?: Aliases;
			options?: Options;
			arguments?: Arguments;
			handler?: () => {};
		}

		export const OptionSchema: Schema<Option>;
		export const OptionsSchema: Schema<Options>;
		export const ArgumentSchema: Schema<Argument>;
		export const ArgumentsSchema: Schema<Arguments>;
		export const AliasesSchema: Schema<Aliases>;
		export const Schema: Schema<Object>;
		export function normalize(feature: Object): Object;
	}

	export namespace Provider {
		interface Builder {
			program: () => Promise<void>;
			commander: () => Promise<void>;
			parse: () => Promise<void>;
		}

		interface BuilderConstructor {
			(): Builder;
		}

		interface Object {
			name: string;
			Builder: BuilderConstructor;
		}

		export const Schema: Schema<Object>;
		export const BuilderSchema: Schema<Builder>;
		export function normalize(provider: Object): Object;
		export function normalizeBuilder(Builder: BuilderConstructor): BuilderConstructor;
	}

	interface CommanderOptions {
		feature: Feature.Object;
		isDefault: boolean;
	}

	interface ContextProxy {
		parent: symbol;
		current: symbol;
		feature: Feature.Object;
	}

	export class Context {
		constructor(parent: symbol | null, current: symbol, feature: Feature.Object);
		parent: symbol;
		current: symbol;
		feature: Feature.Object;
		readonly proxy: Readonly<ContextProxy>;
		create(current: symbol, feature: Feature.Object): Context;
	}

	export class Commander {
		constructor(feature: Feature.Object);
		symbol: symbol;
		feature: Feature.Object;
		parent: Commander | null;
		children: Commander[];
		defaultChild: Commander | null;
		readonly name: string;
		readonly options: CommanderOptions;
		readonly isDefault: boolean;
		hasChild(name: string): boolean;
		setDefaultChild(name: string): void;
		appendChild(commander: Commander, asDefault?: boolean): void;
	}

	class CustomCommander extends Commander {
		build(parentContext: Context): Promise<void>;
		parse(argv: Argv): Promise<void>;
	}

	export function define(provider: Provider.Object): typeof CustomCommander;
}

interface CLIKit extends Duck.ProductKit {
	Commander: typeof Bridge.CustomCommander;
	setProgram: (commander: Bridge.CustomCommander) => void;
}

interface CLI {
	parser: (argv: Argv) => Promise<void>;
}

declare module 'produck/duck' {
	interface ProductKit {
		CLI: CLI;
	}
}

type Factory = (Kit: CLIKit) => void;

export function Component(
	factory: Factory,
	provider: Bridge.Provider.Object
): Duck.Component;

export const defineProvider: Duck.AnyDefiner<Bridge.Provider.Object>;
export const defineFeature: Duck.AnyDefiner<Bridge.Feature.Object>;
export const defineFactory: Duck.AnyDefiner<Factory>;
