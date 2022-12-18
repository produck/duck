import { EventEmitter } from 'node:events';
import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold';

interface RunningKit extends Duck.ProductKit {}

type Actor = () => Promise<void>;

interface BootingDependency {
	/**
	 * Mode name.
	 */
	name: string;
	actors: Actor;
}

interface BootingKit extends RunningKit {
	Booting: BootingDependency;
}

interface ActingDependency {
	/**
	 * Role name
	 */
	name: string;
}

interface ActingKit extends RunningKit {
	Acting: ActingDependency;
}

interface Runner {
	start: (mode: string) => Promise<void>;
}

declare module '@produck/duck' {
	interface ProductKit {
		Runner: Runner;
		Bus: EventEmitter;
	}
}

type Execute = (Kit: BootingKit) => Promise<void>;
type Play = (Kit: ActingKit) => Promise<void>;

interface Options {
	modes: { [name: string]: Execute };
	roles: { [name: string]: Play };
}

export namespace Options {
	export const Schema: Schema<Options>;
	export function normalize(options: Options): Options;
}

export namespace Template {
	export function Solo(
		boot: (next: () => Promise<void>) => void,
		act: (name: string, next: () => Promise<void>) => void
	): Execute;

	export function Processes(
		boot: (next: () => Promise<void>) => void,
		act: (name: string, next: () => Promise<void>) => void
	): Execute;
}

export const defineExecute: Duck.AnyDefiner<Execute>;
export const definePlay: Duck.AnyDefiner<Play>;
export function Component(options: Options): Duck.Component;
