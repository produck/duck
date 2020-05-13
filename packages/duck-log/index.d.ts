import Duck from '@or-change/duck'

declare module '@or-change/duck' {

	interface BaseInjection {
		/**
		 * Logger Manager
		 */
		Log: DuckLog.Log
	}
}

declare namespace DuckLog {
	interface DuckLogInjecion extends Duck.InstalledInjection {};

	interface Log {
		[channelName: String]: writeToDefaultLevel
	}

	/**
	 * Bootstrap Log Manager
	 */
	function Log(): void

	type writeToDefaultLevel = (message) => void

	type LevelName = String

	type Message = String

	type Formater =  (
		meta,

		message: Message
	) => Message

	interface Appender {

		write(
			message: Message
		): void
	}

	type AppenderProvider = (
		injection: DuckLogInjecion
	) => Appender

	interface ChannelOptions {
		label: String

		format: Formater

		AppenderList: AppenderProvider[]

		preventLevels: LevelName[]

		defaultLevel: LevelName

		levels: LevelName[]
	}

	interface Options {
		[channelName: String]: ChannelOptions
	}
}

declare function DuckLog(

	options?: DuckLog.Options
): Duck.Component

export = DuckLog