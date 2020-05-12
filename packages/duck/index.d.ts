import Injection from './src/Injection';
import Normalizer from './src/Normalizer';
import Validator from './src/Validator';

declare namespace ProductProvider {
	export interface BaseInjectionProxy extends Injection.Proxy {

		product;
	};

	type DefaultInstalledInjectionExtends = {};

	interface DefaultInstalledInjection extends DefaultInstalledInjectionExtends {
		[key: string]: any;
	};

	type Assembler<T = DefaultInstalledInjection> = (
		injection: ParameterizedInstalledInjection<T>,

		options?: any
	) => any;

	interface BaseInstalledInjection extends BaseInjectionProxy {
		some: any
	}

	interface ExtendableInstalledInjection extends BaseInstalledInjection {
		product: Object;
	}

	type ParameterizedInstalledInjection<
		CustomT = DefaultInstalledInjection
	> = ExtendableInstalledInjection & CustomT;

	interface InstalledInjection extends ParameterizedInstalledInjection {};

	declare function Product(): any;

	export declare interface Component {

		id: String,

		name: String,

		install: (
			injection: BaseInjectionProxy
		) => void;

		created?: (
			injection: InstalledInjection
		) => void;

		description?: String;

		getDetails?(): any;
	}

	declare interface Options {
		id: String;

		name?: String = 'Default Product Name';

		namespace?: String = '';

		version?: String = '0.0.0';

		description?: String = 'No descrition';

		/**
		 * Duck components list. Use to mixin some function into injection.
		 */
		components?: Array<Component>;
	}
}

declare function ProductProvider(

	options: ProductProvider.Options,

	assembler?: ProductProvider.Assembler
): typeof Product;

ProductProvider.Injection = Injection;
ProductProvider.Normalize = Normalizer;
ProductProvider.Validator = Validator;

export = ProductProvider;