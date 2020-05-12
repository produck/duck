import Duck = require('@or-change/duck');

declare module "@or-change/duck" {
	interface InstalledInjection {
		Web: Object;
		other: any;
	};
};

declare namespace DuckWeb {
	export interface Options {

	}


	function Provider(optsions: DuckWeb.Options): Duck.Component;
}

export = DuckWeb.Provider;