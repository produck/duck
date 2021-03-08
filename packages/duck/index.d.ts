import Injection from './src/Injection'
import Normalizer from './src/Normalizer'
import Validator from './src/Validator'

declare namespace ProductProvider {
	const Injection: Injection
	const Normalizer: Normalizer
	const Validator: Validator

	namespace ProductInfo {
		interface Meta {

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

		interface Component {

			id: String

			name: String

			description: String

			details: any
		}

		interface Duck {

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

	interface ProductInfo {

		/**
		 * Product meta information
		 */
		readonly meta: ProductInfo.Meta

		/**
		 * Abstracts of this ProductProvider
		 */
		readonly components: Array<ProductInfo.Component>

		/**
		 * Information of Duck
		 */
		readonly duck: ProductInfo.Duck
	}

	interface BaseInjection extends Injection.Proxy {

		/**
		 * The assembly information & meta about Product.
		 */
		product: ProductInfo
	}


	interface InstalledInjection extends BaseInjection {}

	interface Component {

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
		getDetails?<Detail>(): Detail
	}

	type Installed = (injection: BaseInjection) => void

	interface Options {
		/**
		 * Product id
		 */
		id?: String

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

type Product<ProductType> = (options: object) => ProductType

type Assembler<ProductType> = (
	injection: ProductProvider.InstalledInjection,
	options: object
) => ProductType

declare function ProductProvider<ProductType>(
	options: ProductProvider.Options,
	assembler: Assembler<ProductType>
): Product<ProductType>

export = ProductProvider