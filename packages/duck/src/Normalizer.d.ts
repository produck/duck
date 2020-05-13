
declare namespace Normalizer {
	function validator(
		/**
		 * The `options` waiting to be detected.
		 */
		options: any
	): Boolean

	interface Options {
		/**
		 * How to handle a `options` to be a `finalOptions`.
		 */
		handler?: (options: any) => any

		/**
		 * Providing an initial `options`
		 */
		default?: () => any

		/**
		 * Assertion for the input `options`.
		 * Throw a exception if options is invalid.
		 */
		validate?: (options: any) => Boolean
	}

	interface FinalOptions extends Options {}
}

/**
 * Use to create a normalizer to help normalizing options.
 */
declare function Normalizer(
	/**
	 * The options to create a normalizer
	 */
	options: Normalizer.Options
): Normalizer.FinalOptions

export = Normalizer