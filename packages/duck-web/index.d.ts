import Duck from '@produck/duck'
import http from 'http'

declare namespace DuckWeb {

	interface DuckWebInjection extends Duck.InstalledInjection {}

	interface DuckWebApplicationInjection extends DuckWebInjection {}

	type Application = (options?: object) => http.RequestListener;

	type ApplicationProvider = (
		/**
		 * An isolating injection.
		 *
		 * [Duck.Base] <|-- [Duck.Installed] <|-- [DuckWeb]
		 * <|-- [DuckWeb.Application<app_id>]
		 */
		injection: DuckWebApplicationInjection
	) => Application;

	interface Options {

		/**
		 * Unique application id
		 */
		id: string;

		/**
		 * The description of this Application
		 */
		description?: string;

		/**
		 * The ApplicationProvider
		 */
		Application: ApplicationProvider;
	}

	interface Web {
		Application(

			/**
			 * The registed Application name
			 */
			name: string,

			/**
			 * Application Instancing Parameters
			 */
			...args: any[],
		): http.RequestListener;
	}
}

declare module '@produck/duck' {
	interface BaseInjection {
		/**
		 * Web Application Factory Manager
		 */
		Web: DuckWeb.Web;
	}
}

declare function DuckWeb(options: Array<DuckWeb.Options>): Duck.Component;

export = DuckWeb;