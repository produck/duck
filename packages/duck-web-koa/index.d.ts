import Koa from 'koa';
import DuckWeb from '@produck/duck-web';

declare namespace DuckWebKoa {
	interface DuckWebKoaInjection extends DuckWeb.DuckWebInjection {}

	type Plugin = (injection: DuckWebKoaInjection) => void;

	interface Options {
		plugins: Array<Plugin>,
		installed?: Function,
	}

	type Assembler = (
		app: Koa<Koa.DefaultState, Koa.DefaultContext>,
		injection: DuckWeb.DuckWebApplicationInjection,
		options?: Options
	) => void;
}

declare function DuckWebKoa(factory: DuckWebKoa.Assembler, options: DuckWebKoa.Options): DuckWeb.ApplicationProvider;

export = DuckWebKoa;