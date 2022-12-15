import * as Duck from '@produck/duck';
import { Schema } from '@produck/mold/types/schema';
import Workspace from '@produck/workspace';

interface WorkspaceOptions {
	root?: string;
	[key: string]: string;
}

export function Component(options: WorkspaceOptions): Duck.Component;

declare module '@produck/duck' {
	interface ProductKit {
		Workspace: Workspace;
	}
}

export namespace Options {
	const Schema: Schema<WorkspaceOptions>;

	export function normalize(options: WorkspaceOptions): WorkspaceOptions;
}
