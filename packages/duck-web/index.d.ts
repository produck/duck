import { RequestListener } from 'http';
import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold';

export interface ApplicationKit extends Duck.ProductKit {}

type Application = <T>(...args: T[]) => RequestListener;
type Provider = (Kit: ApplicationKit) => Application;

interface Descriptor {
	id: string;
	provider: Provider;
	description?: string;
}

interface ApplicationBuilder {
	<T>(id: string, ...args: T[]): RequestListener;
}

interface WebRegistry {
	register: (descriptor: Descriptor) => void;
	Application: ApplicationBuilder;
	App: ApplicationBuilder;
}

type Options = Array<Descriptor>;

export function Component(options: Options): Duck.Component;

declare module '@produck/duck' {
	interface ProductKit {
		Web: WebRegistry;
	}
}

export function defineApplication(provider: Provider): Provider;

export namespace Options {
	export const Schema: Schema<Options>;
	export const DescriptorSchema: Schema<Descriptor>;
	export function normalize(options: Options): Options;
	export function normalizeDescriptor(descriptor: Descriptor): Descriptor;
}

export namespace Preset {
	export const Default: Provider;
	export const RedirectHttps: Provider;
}
