import * as Ow from '@produck/ow';
import { defineComponent, defineAny } from '@produck/duck';
import { T } from '@produck/mold';

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
					return Ow.Error.Common(`Duplicate Application(${id}).`);
				}

				const ApplicationKit = Kit(`Application<${id}>`);
				const Application = provider(ApplicationKit);

				if (!T.Native.Function(Application)) {
					return Ow.Invalid('.provider()=>', 'function');
				}

				const ApplicationProxy = (...args) => {
					const requestListener = Application(...args);

					if (!T.Native.Function(requestListener)) {
						return Ow.Invalid(`Application(${id})=>`, '(req, res) => any');
					}

					return requestListener;
				};

				map.set(id, { id, description, ApplicationProxy });
			};

			const Application = function Application(id, ...args) {
				if (!T.Native.String(id)) {
					return Ow.Invalid('id', 'string');
				}

				if (!map.has(id)) {
					return Ow.Error.Common(`No application(${id}) existed.`);
				}

				return map.get(id).ApplicationProxy(...args);
			};

			Kit.Web = Object.freeze({ register, Application, App: Application });

			next();

			for (const Application of staticApplicationList) {
				register(Application);
			}
		},
	});
};

export {
	defineAny as defineApplication,
	DuckWebComponent as Component,
	Options,
	Preset,
};
