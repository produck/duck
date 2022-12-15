import * as Duck from '@produck/duck';
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
