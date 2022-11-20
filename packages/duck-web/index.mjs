import { defineComponent } from '@produck/duck';
import { Normalizer, P, S, T } from '@produck/mold';
import version from './version.mjs';

const DescriptorSchema = S.Object({
	id: P.String(),
	provider: P.Function(),
	description: P.String('No description.')
});

const DuckWebOptionsSchema = S.Array({
	items: DescriptorSchema,
	key: item => item.id
});

const normalizeDescriptor = Normalizer(DescriptorSchema);
const normalize = Normalizer(DuckWebOptionsSchema);

const meta = {
	id: 'org.produck.duck.web',
	name: 'DuckWeb',
	version,
	description: 'For creating and managing multiple application providers.'
};

const DuckWebProvider = (options) => {
	const staticApplicationList = normalize(options);

	return defineComponent({
		...meta,
		install: Kit => Kit.Web = {},
		created: ({ Kit, Web }) => {
			const DuckWebKit = Kit('DuckWeb');
			const ApplicationMap = new Map();

			const register = descriptor => {
				const { id, Provider, description } = normalizeDescriptor(descriptor);
				const ApplicationKit = DuckWebKit(`DuckWeb::Application::<${id}>`);

				ApplicationKit.WebAppMeta = Object.freeze({ id, description });

				const Application = Provider(ApplicationKit);

				if (!T.Native.Function(Application)) {
					throw new TypeError('');
				}

				if (ApplicationMap.has(id)) {
					throw new Error(`Duplicate Application id=${id}.`);
				}

				ApplicationMap.set(id, function ApplicationProxy(...args) {
					const application = Application(...args);

					if (!T.Native.Function(application)) {
						throw new Error('Bad application, one "(req, res) => void" expected.');
					}

					return application;
				});
			};

			const Application = id => {
				if (!T.Native.String(id)) {
					throw new TypeError('Invalid "id", one "string" expected.');
				}

				if (!ApplicationMap.has(id)) {
					throw new Error(`No application id="${id}" existed.`);
				}

				return ApplicationMap.get(id);
			};

			staticApplicationList.forEach(register);
			Object.assign(Web, { register, Application });
			Object.freeze(Web);
		}
	});
};

export { DuckWebProvider as Provider };
export { DuckWebOptionsSchema as Schema };
export { DescriptorSchema };
export * as Preset from './src/Preset.mjs';