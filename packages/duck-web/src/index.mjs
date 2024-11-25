import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';
import { defineComponent, defineAny, Utils } from '@produck/duck';

import * as Preset from './Preset.mjs';
import * as Options from './Options.mjs';
import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.web',
	name: 'DuckWeb',
	version,
	description: 'For creating and managing multiple application providers.',
});

const DEFAULT_APPLICATION = Object.freeze({
	id: 'Default',
	provider: Preset.Default,
	description: 'Display the product definition meta data.',
});

const DuckWebComponent = (options = [DEFAULT_APPLICATION]) => {
	const staticApplicationList = Options.normalize(options);

	return defineComponent({
		...meta,
		install: ({ Kit }, next) => {
			const map = new Map();

			const register = descriptor => {
				const finalDescriptor = Options.normalizeDescriptor(descriptor);
				const { id, provider, description } = finalDescriptor;

				if (map.has(id)) {
					Ow.Error.Common(`Duplicate Application(${id}).`);
				}

				const ApplicationKit = Kit(`Application<${id}>`);
				const Application = provider(ApplicationKit);

				Assert.Type.Function(Application, '.provider()=>');

				const ApplicationProxy = (...args) => {
					const requestListener = Application(...args);

					Assert.Type.Function(requestListener, `Application(${id})=>`);

					return requestListener;
				};

				map.set(id, { id, description, ApplicationProxy });
			};

			const Web = Kit.Web = {
				register,
				Application: Utils.throwNotInstalled,
				get App() {
					return this.Application;
				},
			};

			next();

			for (const Application of staticApplicationList) {
				register(Application);
			}

			Web.Application = function Application(id, ...args) {
				Assert.Type.String(id, 'id');

				if (!map.has(id)) {
					Ow.Error.Common(`No application(${id}) existed.`);
				}

				return map.get(id).ApplicationProxy(...args);
			};

			Object.freeze(Web);
		},
	});
};

export {
	defineAny as defineApplication,
	DuckWebComponent as Component,
	Options,
	Preset,
};
