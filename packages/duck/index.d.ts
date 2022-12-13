import { GlobalKit } from '@produck/kit';
import { Schema } from '@produck/mold/types/schema';

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

interface ProductKit extends DefinitionKit {}

interface Component {
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

interface defineProduct {
	<Type>(
		options: ProductOptions,
		assembler: () => any
	): (...args: any[]) => Type;
}

export function defineAny<T>(any: T): T;
export function defineComponent(component: Component): Component;
export const define: defineProduct;
export const defineProduct: defineProduct;

export namespace Options {
	export function normalize(options: ProductOptions): ProductOptions;
	export const Schema: Schema<ProductOptions>;
	export const ComponentSchema: Schema<Component>;
}
