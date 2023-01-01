import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold';

type Argv = string[];

export namespace Bridge {
	export namespace Feature {
		interface ValueOptions {
			name: string;
			required: boolean;
			default?: boolean | string | Array<string>;
			variadic?: boolean;
		}

		interface Option {
			name: string;
			alias?: string | null;
			value?: null | string | ValueOptions;
			required?: boolean;
			description?: string | null;
		}

		interface Argument {
			name: string;
			description?: string;
			required?: boolean;
			default?: string;
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
		export function normalize(feature: Object): Required<Object>;
	}

	export namespace Provider {
		interface Builder {
			program: (options: CommanderOptions) => Promise<void>;
			commander: (options: CommanderOptions) => Promise<void>;
			parse: (argv: Argv) => Promise<void>;
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
		parent: symbol | null;
		current: symbol;
		feature: Feature.Object;
		isDefault: boolean;
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
		parse(argv?: Argv): Promise<void>;
	}

	export function define(provider: Provider.Object): typeof CustomCommander;
}

interface CLIKit extends Duck.ProductKit {
	Commander: typeof Bridge.CustomCommander;
	setProgram: (commander: Bridge.CustomCommander) => void;
}

interface CLI {
	parser: (argv?: Argv) => Promise<void>;
}

declare module '@produck/duck' {
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
