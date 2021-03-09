import '@produck/duck'
declare namespace Workspace {

}

interface Workspace {
	/**
	 * Current root path, an absolute path.
	 *
	 */
	root: string;

	/**
	 * `Workspace.buildRoot()` & all `Workspace.build()`.
	 */
	buildAll(): Promise<void>;

	/**
	 * Build the root path in fs.
	 */
	buildRoot(): Promise<void>;

	/**
	 * Build a specific name path in fs.
	 * @param name The name of path.
	 * @param pathname A relative path after the path specify by the name.
	 */
	build(name: string, pathname?: string): Promise<void>;

	/**
	 * Setting a named path. Overrides the path to a special directory or
	 * file associated with name.
	 * @param name The name of path.
	 * @param pathname A relative path after the path specify by the name.
	 * @param fromRoot If resolving path from the root or not. Default: `true`
	 */
	setPath(name: string, pathname: string, fromRoot?: boolean): void;

	/**
	 * Getting a named path. On failure, an Error is thrown.
	 * @param name The name of path.
	 */
	getPath(name: string);

	/**
	 * Resolving a path by named path with a sub path.
	 * @param name The name of path.
	 * @param pathname A relative path after the path specify by the name.
	 */
	resolve(name: string, pathname: string);
}

declare module '@produck/duck' {
	interface BaseInjection {

		/**
		 * Helping product to manage important path and easy to resolve.
		 * Access named path.
		 */
		Workspace: Workspace
	}
}