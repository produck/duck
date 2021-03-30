import Duck from '@produck/duck';
import http from 'http';
import https from 'https';

declare module '@produck/duck' {
	interface BaseInjection {
		Log: DuckLog.LogInjection;
	}
}

declare namespace DuckLog {
	interface LogInjection {
		(categoryName: string, options: CategoryLogger.Options): void;
		[categoryName: string]: CategoryLogger;
	}

	interface Options {
		/**
		 *
		 */
		[categoryName: string]: CategoryLogger.Options | boolean;
	}

	export namespace CategoryLogger {
		interface LevelLogger {
			(messageObject: any): Promise<void>
		}

		export interface Options {
			/**
			 *
			 */
			label: String;

			/**
			 *
			 */
			format: Helper.Format.Formatter;

			/**
			 *
			 */
			AppenderList: Helper.Appender.Factory[];

			/**
			 *
			 */
			preventLevels: string[];

			/**
			 *
			 */
			defaultLevel: string;

			/**
			 *
			 */
			levels: string[];
		}
	}

	export interface CategoryLogger extends CategoryLogger.LevelLogger {
		(messageObject: any): Promise<void>;
		[levelName: string]: CategoryLogger.LevelLogger;
	}

	namespace Helper {
		namespace Appender {
			interface Writable {
				write(messageObject: any): void | Promise<void>;
			}

			type Factory = () => Writable;

			interface Module {
				Stdout: Factory;
				Stderr: Factory;
				Console: () => Factory;
				File: (options: object) => Factory;
			}
		}

		namespace Format {
			interface Formatter {
				(meta: object, messageObject: any): string;
			}

			type Factory = () => Formatter;

			interface Module {
				ApacheCLF: Factory;
				ApacheCLFWithVhost: Factory;
				ApacheECLF: Factory;
				InternalError: Factory;
				General: Factory;
			}
		}

		namespace Adapter {
			interface RequestListenerWithLog extends http.RequestListener {}

			interface Module {
				HttpServer: (
					requestListener: http.RequestListener,
					callback: (message: string) => any
				) => RequestListenerWithLog
			}
		}
	}

	export const Appender: Helper.Appender.Module;
	export const Format: Helper.Format.Module;
	export const Adapter: Helper.Adapter.Module;
}

/**
 *
 * @param options
 */
declare function DuckLog(options?: DuckLog.Options): Duck.Component;

export = DuckLog;
