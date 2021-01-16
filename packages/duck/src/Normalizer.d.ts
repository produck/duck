
declare namespace Normalizer {

	type Validator = (Options: any) => Boolean;

	function validator(
		/**
		 * The `options` waiting to be detected.
		 */
		options: any
	): Boolean;

	interface Options {
		/**
		 * How to handle a `options` to be a `finalOptions`.
		 */
		handler?: (options: any) => any;

		/**
		 * Providing an initial `options`
		 */
		default?: () => any;

		/**
		 * Assertion for the input `options`.
		 * Throw a exception if options is invalid.
		 */
		validate?: Validator;
	}

	interface FinalOptions extends Options {}
}

interface Normalizer {
	(options: Normalizer.Options): Normalizer.FinalOptions;
}

/**
 * Use to create a normalizer to help normalizing options.
 */
declare function Normalizer(
	/**
	 * The options to create a normalizer
	 */
	options: Normalizer.Options
): Normalizer.FinalOptions;

export = Normalizer;