import Workspace from '@produck/workspace';
import { C, Custom, Normalizer, P, PROPERTY, S, T } from '@produck/mold';
import { defineComponent } from '@produck/duck';

import version from './version.mjs';

const NamedPathSchema = Custom(C.Or([
	P.String(process.cwd()),
	P.Function(() => process.cwd())
]), (_value, _empty, next) => {
	const namedPath = next();

	return T.Native.Function(namedPath) ? namedPath : () => namedPath;
});

const DuckWorkspaceOptionsSchema = S.Object({
	root: NamedPathSchema,
	[PROPERTY]: NamedPathSchema
});

const normalize = Normalizer(DuckWorkspaceOptionsSchema);

const meta = defineComponent({
	id: 'org.produck.duck.workspace',
	name: 'DuckWorkspace',
	version,
	description: 'Helping product to manage important path and easy to resolve.'
});

const DuckWorkspaceProvider = options => {
	const staticNamedPathOptions = normalize(options);

	return defineComponent({
		...meta,
		created: Kit => {
			const WorkspaceKit = Kit('DuckWorkspace');
			const workspace = Kit.Workspace = new Workspace();

			for (const name of staticNamedPathOptions) {
				workspace.setPath(name, staticNamedPathOptions[name](WorkspaceKit));
			}
		}
	});
};

export { DuckWorkspaceProvider as Provider };
