import { GlobalKit } from '@produck/kit';

interface DuckKit extends GlobalKit {
	duck: { version: string }
}

interface ProviderKit extends DuckKit {
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

interface BaseKit extends ProviderKit {

}

interface InstalledKit extends BaseKit {

}

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
	install?: (Kit: BaseKit, scope?: {}) => void;

	/**
	 * Invoking after all components have been installed.
	 * You MAY set some new functions into installedInjection
	 */
	created?: (Kit: InstalledKit, scope?: {}) => void;

	/**
	 * Description of the component.
	 */
	description?: String;
}

interface ProductProviderOptions {
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

interface ProductProvider {
	<Type>(
		options: ProductProviderOptions,
		assembler: () => any
	): (...args: any[]) => Type;
}

export function defineComponent(component: Component): Component;
export const Provider: ProductProvider;