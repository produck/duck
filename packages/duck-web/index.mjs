import { defineComponent } from '@produck/duck';
import { Normalizer, P, S, T } from '@produck/mold';

const DuckWebOptionsSchema = S.Array({
	items: S.Object({
		id: P.String(),
		provider: P.Function(),
		description: P.String()
	}),
	key: item => item.id
});

const normalize = Normalizer(DuckWebOptionsSchema);

const DuckWebProvider = (options) => {
	const finalOptions = normalize(options);

	return defineComponent({
		id: 'org.produck.duck.web',
		name: 'DuckWeb',
		description: 'For creating and managing multiple application providers.',
		install: Kit => Kit.Web = {},
		created: ({ Kit, Web }) => {
			const DuckWebKit = Kit('DuckWeb');
			const ApplicationMap = new Map();

			for (const descriptor of finalOptions) {
				const { id, provider, description } = descriptor;
				const ApplicationKit = DuckWebKit(`DuckWeb::Application::<${id}>`);

				ApplicationKit.WebAppMeta = Object.freeze({ id, description });

				const Application = provider(ApplicationKit);

				if (!T.Native.Function(Application)) {
					throw new TypeError();
				}

				ApplicationMap.set(id, Application);
			}

			const Application = (id, ...args) => {
				if (!T.Native.String(id)) {
					throw new TypeError('Invalid "id", one "string" expected.');
				}

				if (!ApplicationMap.has(id)) {
					throw new Error(`No application id="${id}" existed.`);
				}

				const application = ApplicationMap.get(id)(...args);

				if (!T.Native.Function(application)) {
					throw new Error('Bad application, one "function like (req, res) => void" expected.');
				}

				return application;
			};

			DuckWebKit.Web = Application;
			Object.freeze(Web);
		},
		details: () => {

		}
	});
};

export { DuckWebProvider as DuckWeb };
export * as Preset from './src/Preset.mjs';