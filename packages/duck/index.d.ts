import { GlobalKit } from '@produck/kit';
import { Schema } from '@produck/mold';

interface DuckKit extends GlobalKit {
	duck: { version: string }
}

interface DefinitionKit extends DuckKit {
	produck: {
		meta: {
			id: string;
			name: string;
			version: string;
			description: string;
		};

		components: Array<{
			id: string;
			name: string;
			version: string;
			description: string;
		}>;
	};
}

export interface ProductKit extends DefinitionKit {
	[key: string]: unknown;
}

export interface Component {
	/**
	 * The component unique id.
	 * Example: org.orchange.duck.default
	 */
	id: string,

	/**
	 * The component name for reading.
	 */
	name: string,

	/**
	 * The component version in semver.
	 */
	version?: string;

	/**
	 * Invoking when Product is called.
	 * Some new functions CAN be set into baseInjection
	 */
	install?: (Kit: ProductKit, next: () => unknown) => unknown;

	/**
	 * Description of the component.
	 */
	description?: string;
}

interface ProductOptions {
	/**
	 * Product id
	 */
	id: string

	name?: string

	version?: string

	description?: string

	/**
	 * Duck components list. Use to mixin some function into injection.
	 */
	components?: Array<Component>
}

type Product<ProductType> = (...args: unknown[]) => ProductType

type Assembler<ProductType> = (
	Kit: ProductKit,
	...args: unknown[]
) => ProductType

export function defineProduct<ProductType = ProductKit>(
	options: ProductOptions,
	assembler: Assembler<ProductType>
): Product<ProductType>

export interface AnyDefiner<T = unknown> {
	(any: T): T;
}

export const defineAny: AnyDefiner;
export const defineComponent: AnyDefiner<Component>;
export { defineProduct as define };

type InjectionTarget = <T = unknown>(Kit: ProductKit) => T;

export const inject: AnyDefiner<InjectionTarget>;

export namespace Options {
	export function normalize(options: ProductOptions): ProductOptions;
	export const Schema: Schema<ProductOptions>;
	export const ComponentSchema: Schema<Component>;
}

export namespace Utils {
	export function throwNotInstalled(): never;
}
