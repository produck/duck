
export namespace CategoryLogger {
	interface LevelLogger {
		(messageObject: any): Promise<void>
	}

	export interface Options {
		/**
		 *
		 */
		label: String

		/**
		 *
		 */
		format: Formater

		/**
		 *
		 */
		AppenderList: AppenderProvider[]

		/**
		 *
		 */
		preventLevels: string[]

		/**
		 *
		 */
		defaultLevel: string

		/**
		 *
		 */
		levels: string[]
	}
}

export interface CategoryLogger extends CategoryLogger.LevelLogger {
	(messageObject: any): Promise<void>;
	[levelName: string]: CategoryLogger.LevelLogger;
}
