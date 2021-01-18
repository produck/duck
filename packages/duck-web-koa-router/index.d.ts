import DuckWebKoa from '@produck/duck-web-koa'
import KoaRouter from '@koa/router'

declare namespace DuckWebKoaRouterPlugin {
	interface DuckWebKoaRouterInjection extends DuckWebKoa.DuckWebKoaInjection {}
	interface DuckWebKoaRouterInstanceInjection extends DuckWebKoaRouterInjection {}

	interface Options {
		Router: assembler
		prefix?: string
		mount: null | string | Array<string>
		use: Array<Options>
	}

	type assembler = (
		router: KoaRouter,
		injection: DuckWebKoaRouterInstanceInjection
	) => void
}

declare function DuckWebKoaRouterPlugin(
	options: DuckWebKoaRouterPlugin.Options
): DuckWebKoa.Plugin

declare function DuckWebKoaRouter(
	assembler: DuckWebKoaRouterPlugin.assembler
): DuckWebKoaRouterPlugin.assembler

DuckWebKoaRouterPlugin.Router = DuckWebKoaRouter
DuckWebKoaRouterPlugin.Plugin = DuckWebKoaRouterPlugin
export = DuckWebKoaRouterPlugin