import ajv from 'ajv';

declare namespace Validator {
	declare function validator(

		options: any
	): Boolean;

	function DuckAjvValidator(

		schema: Boolean | Object,

		ajvModifier?: (ajv: ajv.Ajv) => void
	): typeof validator;
}

export = Validator.DuckAjvValidator;