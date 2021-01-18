import DuckWebKoa from '@produck/duck-web-koa'
import KoaRouter from '@koa/router'

declare namespace DuckWebKoaRouterPlugin {
	interface DuckWebKoaRouterInjection extends DuckWebKoa.DuckWebKoaInjection {}
	interface DuckWebKoaRouterInstanceInjection extends DuckWebKoaRouterInjection {}

	interface Options {
		/**
		 * A router assembler.
		 */
		Router: assembler

		/**
		 * As prefix options in new KoaRouter({ prefix: ... })
		 */
		prefix?: string

		/**
		 * As router.use(<mount>, middleware[, ...]) for childRouter in `options.use`.
		 */
		mount: null | string | Array<string>

		/**
		 * Providing a list of `options` to define some child routers.
		 */
		use: Array<Options>
	}

	type assembler = (
		/**
		 * A router instance of `@koa/router`.
		 */
		router: KoaRouter,

		/**
		 * A duck injection inherit from `DuckWebKoaRouterInjection`.
		 */
		injection: DuckWebKoaRouterInstanceInjection
	) => void
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
	assembler: DuckWebKoaRouterPlugin.assembler
): DuckWebKoaRouterPlugin.assembler

DuckWebKoaRouterPlugin.Router = DuckWebKoaRouter
DuckWebKoaRouterPlugin.Plugin = DuckWebKoaRouterPlugin

export = DuckWebKoaRouterPlugin