
declare namespace Injection {
	type name = string;

	declare interface Proxy {

		/**
		 * The reference of this injection for esay setting.
		 */
		injection: Proxy

		/**
		 * To create a new injection base on this one.
		 */
		$create(

			/**
			 * The name of the new injection.
			 */
			name: name
		): Proxy;
	}
}

/**
 * InjectionProxy object, `injection.foo = {}` to set a new function.
 */
function Injection(

	/**
	 * The name of the new injection.
	 */
	name?: Injection.name = '<Anonymous>',

	/**
	 * The prototype of the new injection proxy.
	 */
	_parent?: !Object = Object.prototype,
): Injection.Proxy

export = Injection;