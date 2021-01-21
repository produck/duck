import DuckWebKoa from '@produck/duck-web-koa';
import KoaRouter from '@koa/router';

declare namespace DuckWebKoaRouterPlugin {
	interface DuckWebKoaRouterInjection extends DuckWebKoa.DuckWebKoaInjection { }
	interface DuckWebKoaRouterInstanceInjection extends DuckWebKoaRouterInjection { }

	type Assembler = (
		/**
		 * A router instance of `@koa/router`.
		 */
		router: KoaRouter,

		/**
		 * A duck injection inherit from `DuckWebKoaRouterInjection`.
		 */
		injection: DuckWebKoaRouterInstanceInjection
	) => void;

	interface Options {
		/**
		 * A router assembler.
		 */
		Router: Assembler

		/**
		 * As prefix options in new KoaRouter({ prefix: ... })
		 */
		prefix?: string

		/**
		 * As router.use(<mount>, middleware[, ...]) for childRouter in `options.use`.
		 */
		mount?: null | string | Array<string>

		/**
		 * Providing a list of `options` to define some child routers.
		 */
		use?: Array<Options>
	}

	type Install = (options?: DuckWebKoaRouterPlugin.Options) => KoaRouter;

	type DuckWebKoaRouter = (
		/**
	 * Providing a function as an assembler for defining a router.
	 * The name of router assembler(function) is optional.
	 */
		assembler: DuckWebKoaRouterPlugin.Assembler) => DuckWebKoaRouterPlugin.Assembler;

	type DuckWebKoaRouterPlugin = (
		/**
	 * Providing an `options` to define root router.
	 */
		options: DuckWebKoaRouterPlugin.Options) => DuckWebKoa.Plugin;

	const Router: DuckWebKoaRouter;
	const Plugin: DuckWebKoaRouterPlugin;
}

declare function DuckWebKoaRouterPlugin(
	/**
	 * Providing an `options` to define root router.
	 */
	options: DuckWebKoaRouterPlugin.Options
): DuckWebKoa.Plugin

declare function DuckWebKoaRouter(
	/**
	 * Providing a function as an assembler for defining a router.
	 * The name of router assembler(function) is optional.
	 */
	assembler: DuckWebKoaRouterPlugin.Assembler
): DuckWebKoaRouterPlugin.Assembler

declare module '@produck/duck-web-koa' {
	interface DuckWebKoaInjection {
		/**
		 * Web Application Factory Manager
		 */
		AppRouter: DuckWebKoaRouterPlugin.Install;
	}
}

export = DuckWebKoaRouterPlugin;