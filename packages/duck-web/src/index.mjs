import { defineComponent } from '@produck/duck';

import * as Application from './Application/index.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.web',
	name: 'DuckWeb',
	version,
	description: 'For creating and managing multiple application providers.'
});

const DuckWebProvider = (options) => {
	const staticApplicationList = Options.normalize(options);

	return defineComponent({
		...meta,
		install: Kit => Kit.Web = {},
		created: ({ Kit, Web }) => {
			const registry = new Application.Registry(Kit);

			for (const id in staticApplicationList) {
				registry.register(staticApplicationList[id]);
			}

			Object.assign(Web, {
				register: options => registry.register(options),
				// Web.Application('name')(...args);
				Application: id => registry.get(id),
				getAllApplicationMetaList: () => {
					return Array.from(registry.map.values()).map(Factory => {
						return {
							id: Factory.id,
							description: Factory.description
						};
					});
				}
			});

			Object.freeze(Web);
		}
	});
};

export { DuckWebProvider as Provider };
export { Application };
export * as Preset from './Preset.mjs';