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

export interface ProductKit extends DefinitionKit {}

export interface Component {
	/**
	 * The component unique id.
	 * Example: org.orchange.duck.default
	 */
	id: String,

	/**
	 * The component name for reading.
	 */
	name: String,

	/**
	 * The component version in semver.
	 */
	version?: String;

	/**
	 * Invoking when Product is called.
	 * Some new functions CAN be set into baseInjection
	 */
	install?: (Kit: ProductKit) => void;

	/**
	 * Description of the component.
	 */
	description?: String;
}

interface ProductOptions {
	/**
	 * Product id
	 */
	id: String

	name?: String

	version?: String

	description?: String

	/**
	 * Duck components list. Use to mixin some function into injection.
	 */
	components?: Array<Component>
}

type Product<ProductType> = (...args: any[]) => ProductType

type Assembler<ProductType> = (
	Kit: ProductKit,
	...args: any[]
) => ProductType

export function defineProduct<ProductType = ProductKit>(
	options: ProductOptions,
	assembler: Assembler<ProductType>
): Product<ProductType>

export interface AnyDefiner<T = any> {
	(any: T): T;
}

export const defineAny: AnyDefiner;
export const defineComponent: AnyDefiner<Component>;
export { defineProduct as define };

export namespace Options {
	export function normalize(options: ProductOptions): ProductOptions;
	export const Schema: Schema<ProductOptions>;
	export const ComponentSchema: Schema<Component>;
}
