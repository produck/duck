import Duck from '@or-change/duck'
import http from 'http'

declare module '@or-change/duck' {
	interface BaseInjection {
		/**
		 * Web Application Factory Manager
		 */
		Web: DuckWeb.Web
	}
}

declare namespace DuckWeb {

	interface DuckWebInjection extends Duck.InstalledInjection {}

	interface DuckWebApplicationInjection extends DuckWebInjection {}

	type Application = () => http.RequestListener

	type ApplicationProvider = (
		/**
		 * An isolating injection.
		 *
		 * [Duck.Base] <|-- [Duck.Installed] <|-- [DuckWeb]
		 * <|-- [DuckWeb.Application<app_id>]
		 */
		injection: DuckWebApplicationInjection
	) => Application

	export interface Options {

		/**
		 * Unique application id
		 */
		id

		/**
		 * The description of this Application
		 */
		description

		/**
		 * The ApplicationProvider
		 */
		Application: ApplicationProvider
	}

	interface Web {
		Application(

			/**
			 * The registed Application name
			 */
			name,

			/**
			 * Application Instancing Parameters
			 */
			...args: any[]
		): http.RequestListener
	}

	function Provider(optsions?: Options[]): Duck.Component
}

export = DuckWeb.Provider