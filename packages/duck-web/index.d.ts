import { RequestListener } from 'http';
import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold/types/schema';

export interface ApplicationKit extends Duck.ProductKit {}

type Application = (...args: any[]) => RequestListener;
type Provider = (Kit: ApplicationKit) => Application;

interface Descriptor {
	id: string;
	provider: Provider;
	description?: string;
}

interface WebRegistry {
	register: (descriptor: Descriptor) => void;
	Application: (id: string, ...args: any[]) => RequestListener;
}

type Options = Array<Descriptor>;

export function Component(options: Options): Duck.Component;

declare module '@produck/duck' {
	interface ProductKit {
		Web: WebRegistry;
	}
}

export namespace Optiosn {
	export const Schema: Schema<Options>;
	export const DescriptorSchema: Schema<Descriptor>;
	export function normalize(options: Options): Options;
	export function normalizeDescriptor(descriptor: Descriptor): Descriptor;
}

export namespace Preset {
	export const Default: Provider;
	export const RedirectHttps: Provider;
}
