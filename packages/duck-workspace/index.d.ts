import '@produck/duck';
import Workspace from '@produck/workspace';

declare module '@produck/duck' {
	interface ProductKit {
		Workspace: Workspace;
	}
}
