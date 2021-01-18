import DuckWebKoa from "../duck-web-koa";

declare namespace DuckWebKoaRouter {
	interface Options {
		Router: Function;
		prefix?: string;
		mount: null | string | Array<string>
		use: Array<Options>
	}
}

declare function DuckWebKoaRouter(options: DuckWebKoaRouter.Options): DuckWebKoa.Plugin;

export = DuckWebKoaRouter;