import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold';

interface Recorder {
	(message: any): void;
}

declare namespace Logger {
	type Transcriber = (
		label: string,
		levels: Array<string>
	) => Recorder;

	interface OptionsLevel {
		head?: string;
		sequence?: Array<string>;
		prevents?: Array<string>;
	}

	interface Options {
		Transcriber: Transcriber;
		label: string;
		level?: OptionsLevel;
	}

	interface LoggerHandler {
		readonly levels: Array<string>;
		hasLevel(level: string): boolean;
		assertLevel(level: string): void;
		isPrevent(level: string): void;
		resume(level: string): void;
		prevent(level: string): void;
		preventTo(level: string): void;
	}

	interface LoggerProxy extends Recorder {
		[level: string]: Recorder;
		[MODIFIER: symbol]: LoggerHandler;
	}
}

interface LogManager {
	(category: string, options: Logger.Options): void;
	[category: string]: Logger.LoggerProxy;
}

interface Options {
	[key: string]: Logger.Options;
}

declare module '@produck/duck' {
	interface ProductKit {
		Log: LogManager;
	}
}

export namespace Options {
	export const Schema: Schema<Options>;
	export function normalize(options: Options): Options;
}

export function Component(options: Options): Duck.Component;
export const MODIFIER: symbol;

export function defineTranscriber(
	Transcriber: Logger.Transcriber
): Logger.Transcriber;
