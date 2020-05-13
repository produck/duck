import ajv from 'ajv';
import Normalizer from './Normalizer';

declare namespace Validator {

	/**
	 * A Helper for creating ajv validator
	 */
	function DuckAjvValidator(
		/**
		 * A valid AJV Json Schema
		 */
		schema: Boolean | Object,

		/**
		 * Getting a ajv instance to modify it in this function.
		 */
		ajvModifier?: (ajv: ajv.Ajv) => void
	): typeof Normalizer.validator;
}

export = Validator.DuckAjvValidator;