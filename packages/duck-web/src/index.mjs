import { defineComponent } from '@produck/duck';

import * as Preset from './Preset.mjs';
import * as Application from './Application/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.web',
	name: 'DuckWeb',
	version,
	description: 'For creating and managing multiple application providers.'
});

const DEFAULT_APPLICATION = Object.freeze({
	id: 'Default',
	provider: Preset.Default,
	description: 'Display the product definition meta data.'
});

const DuckWebComponent = (options = [DEFAULT_APPLICATION]) => {
	const staticApplicationList = Options.normalize(options);

	return defineComponent({
		...meta,
		install: Kit => {
			const registry = new Application.Registry(Kit);

			for (const id in staticApplicationList) {
				registry.register(staticApplicationList[id]);
			}

			Kit.Web = Object.freeze({
				register: options => registry.register(options),
				Application: id => registry.get(id).ApplicationProxy,
			});
		}
	});
};

export {
	DuckWebComponent as Component,
	Application,
	Preset,
};
