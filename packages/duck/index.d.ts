import Injection from './src/Injection'
import Normalizer from './src/Normalizer'
import Validator from './src/Validator'

declare namespace ProductProvider {

	namespace product {
		interface meta {

			/**
			 * The product id
			 */
			id: String

			/**
			 * The product name
			 */
			name: String

			/**
			 * The product namespace MAY be used in some components.
			 */
			namespace: String

			/**
			 * The product verison defined
			 */
			version: String

			/**
			 * The product description
			 */
			description: String
		}

		interface components {

			id: String

			name: String

			description: String

			details: any
		}

		interface duck {

			/**
			 * Duck version
			 */
			version: String

			/**
			 * The peerDependences in package.json of Duck
			 */
			peerDependencies: Object
		}
	}

	interface product {

		/**
		 * Product meta information
		 */
		readonly meta: product.meta

		/**
		 * Abstracts of this ProductProvider
		 */
		readonly components: product.components[]

		/**
		 * Information of Duck
		 */
		readonly duck: product.duck
	}

	interface BaseInjection extends Injection.Proxy {

		/**
		 * The assembly information & meta about Product.
		 */
		product: product
	}

	function Assembler(

		/**
		 * Installed injection that all component.created()
		 * have been called.
		 */
		injection: InstalledInjection,

		/**
		 * The `options` of Product()
		 */
		options?: any
	): Product

	interface InstalledInjection extends BaseInjection {}

	class Product {
		constructor(

			/**
			 * You MAY provide a options to affect the final product instance.
			 */
			options: any
		)
	}

	export interface Component {

		/**
		 * The component unique id.
		 *
		 * Example: org.orchange.duck.default
		 */
		id: String,

		/**
		 * The component name for reading.
		 */
		name: String,

		/**
		 * Invoking when Product is called.
		 * Some new functions CAN be set into baseInjection
		 */
		install: (
			injection: BaseInjection
		) => void

		/**
		 * Invoking after all components have been installed.
		 * You MAY set some new functions into installedInjection
		 */
		created?: (
			injection: InstalledInjection
		) => void

		/**
		 * Description of the component.
		 */
		description?: String

		/**
		 * Getting state or data of the component implemented by components
		 */
		getDetails?(): any
	}

	interface Options {
		/**
		 * Product id
		 */
		id: String

		name?: String

		namespace?: String

		version?: String

		description?: String

		/**
		 * Duck components list. Use to mixin some function into injection.
		 */
		components?: Array<Component>
	}
}

declare function ProductProvider(
	/**
	 * The options for Duck(ProductProvider)
	 */
	options: ProductProvider.Options,

	/**
	 * Use to create product instance by injeciton & options.
	 * `options` is from Product(options)
	 *
	 */
	assembler?: typeof ProductProvider.Assembler
): typeof ProductProvider.Product

ProductProvider.Injection = Injection
ProductProvider.Normalizer = Normalizer
ProductProvider.Validator = Validator

export = ProductProvider