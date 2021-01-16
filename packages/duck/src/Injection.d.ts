
declare namespace Injection {
	type name = string

	interface Proxy {

		/**
		 * The reference of this injection for esay setting.
		 */
		readonly injection: Proxy;
		/**
		 * To create a new injection base on this one.
		 *
		 * [this] <|-- [new]
		 * newInjection.prototype = this
		 */
		$create(

			/**
			 * The name of the new injection.
			 */
			name: name
		): Proxy;
	}

	interface MyInjection extends Proxy {
		[index: string]: any;
	}
}

interface Injection {
	(name?: Injection.name, _parent?: Object,): Injection.Proxy;
}

/**
 * InjectionProxy object, `injection.foo = {}` to set a new function.
 */
declare function Injection(

	/**
	 * The name of the new injection.
	 */
	name?: Injection.name,

	/**
	 * The prototype of the new injection proxy.
	 * You may NOT use it.
	 */
	_parent?: Object,
): Injection.Proxy;

export = Injection