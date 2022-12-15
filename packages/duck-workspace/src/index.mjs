import Workspace from '@produck/workspace';
import { defineComponent } from '@produck/duck';

import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.workspace',
	name: 'DuckWorkspace',
	version,
	description: 'Helping product to manage important path and easy resolving.',
});

const DuckWorkspaceComponent = (options = {}) => {
	const staticPath = Options.normalize(options);

	return defineComponent({
		...meta,
		install: Kit => {
			const workspace = new Workspace();

			for (const name in staticPath) {
				workspace.setPath(name, staticPath[name]);
			}

			Kit.Workspace = workspace;
		},
	});
};

export { DuckWorkspaceComponent as Component };
