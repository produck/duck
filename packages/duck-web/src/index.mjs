import { defineComponent, define } from '@produck/duck';
import { T, Utils } from '@produck/mold';

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
		install: Kit => {
			const map = new Map();

			const register = descriptor => {
				const finalDescriptor = Options.normalizeDescriptor(descriptor);
				const { id, provider, description } = finalDescriptor;

				if (map.has(id)) {
					throw new Error(`Duplicate Application(${id}).`);
				}

				const ApplicationKit = Kit(`Application<${id}>`);
				const Application = provider(ApplicationKit);

				if (!T.Native.Function(Application)) {
					throw new Error('The `.provider` MUST return a function as `Application`.');
				}

				const ApplicationProxy = (...args) => {
					const requestListener = Application(...args);

					if (!T.Native.Function(requestListener)) {
						throw new Error(`Bad Application(${id}), one "(req, res) => any" expected.`);
					}

					return requestListener;
				};

				map.set(id, { id, description, ApplicationProxy });
			};

			const Application = (id, ...args) => {
				if (!T.Native.String(id)) {
					Utils.throwError('id', 'string');
				}

				if (!map.has(id)) {
					throw new Error(`No application(${id}) existed.`);
				}

				return map.get(id).ApplicationProxy(...args);
			};

			for (const id in staticApplicationList) {
				register(staticApplicationList[id]);
			}

			Kit.Web = Object.freeze({ register, Application, App: Application });
		},
	});
};

export {
	define as defineApplication,
	DuckWebComponent as Component,
	Options,
	Preset,
};
