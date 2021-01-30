import '@produck/duck'
declare namespace Workspace {

}

interface Workspace {
	/**
	 * Current root path, an absolute path.
	 *
	 */
	root: string

	/**
	 * `Workspace.buildRoot()` & all `Workspace.build()`.
	 */
	buildAll(): Promise<void>

	/**
	 * Build the root path in fs.
	 */
	buildRoot(): Promise<void>

	/**
	 * Build a specific name path in fs.
	 */
	build(
		/**
		 * The name of path.
		 */
		name: string,

		/**
		 * A relative path after the path specify by the name.
		 */
		pathname?: string
	): Promise<void>

	/**
	 * Setting a named path. Overrides the path to a special directory or
	 * file associated with name.
	 */
	setPath(
		name: string,
		pathname: string,
		fromRoot?: boolean
	): void

	/**
	 * Getting a named path. On failure, an Error is thrown.
	 */
	getPath(
		name: string
	)

	/**
	 * Resolving a path by named path with a sub path.
	 */
	resolve(
		name: string,
		pathname: string
	)
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