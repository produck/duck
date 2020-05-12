
declare namespace Normalizer {
	declare interface Options {

		handler?: (any: any) => any;

		default?: () => any;

		validate?: (any: any) => Boolean;
	}
}

function Normalizer(

	options: Normalizer.Options
): Normalizer.finalOptions;

export = Normalizer;