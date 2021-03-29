import Duck from '@produck/duck';
import { CategoryLogger } from './src/CategoryLogger';

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
		[categoryName: string]: CategoryLogger.Options | boolean
	}
}

/**
 *
 * @param options
 */
declare function DuckLog(options?: DuckLog.Options): Duck.Component

export = DuckLog;
