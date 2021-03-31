import Duck from '@produck/duck';
import http from 'http';
import https from 'https';

declare module '@produck/duck' {
	interface BaseInjection {
		Log: DuckLog.LogInjection;
	}
}

declare namespace DuckLog {

	/**
	 *
	 * @param categoryName
	 * @param options
	 */
	type appendCategoryLogger = (categoryName: string, options?: CategoryLogger.Options) => void;

	interface LogInjection extends appendCategoryLogger {
		[categoryName: string]: CategoryLogger;
	}

	interface Options {
		/**
		 * Named category options. A simple style just using `true` to indicate using
		 * a default category options.
		 */
		[categoryName: string]: CategoryLogger.Options | boolean;
	}

	export namespace CategoryLogger {
		interface LevelLogger {
			(messageObject: any): Promise<string>;
			(): void;
		}

		export interface Options {
			/**
			 * The category text. It SHOULD be the key, category name if not specified.
			 */
			label: String;

			/**
			 * A definition destribing how to generate a string message from log meta
			 * and custom message object.
			 */
			format: Helper.Format.Formatter;

			/**
			 * A list of what to do after a formated message string be get. Like,
			 *   - output to console
			 *   - write to fs
			 *   - send by net work
			 * ...
			 */
			AppenderList: Helper.Appender.Factory[];

			/**
			 * Making a list of specific categories to be silent.
			 */
			preventLevels: string[];

			/**
			 * To indicate a level logger when trying to call like
			 * `Log.<categoryName>('...')`.
			 * It is same to call `Log.<categoryName>.<defaultLevel>('...')`.
			 *
			 * And the first level is the defualt
			 */
			defaultLevel: string;

			/**
			 * Setting a list of level name. The first one is the default level if
			 * `options.defaultLevel` is NOT indicated.
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
				write(messageObject: any): unknown | Promise<unknown>;
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
			interface Meta {
				level: string;
				time: Date;
				label: string;
			}

			interface Formatter {
				(meta: Meta, messageObject: any): string;
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
				/**
				 * Use to generate a log message included `requestListener` from
				 * original `requestListener`.
				 * @param requestListener a function as `http.RequestListener`.
				 * @param callback what to do after http access message getting.
				 */
				HttpServer(
					requestListener: http.RequestListener,
					callback: (message: string) => any
				): RequestListenerWithLog
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
