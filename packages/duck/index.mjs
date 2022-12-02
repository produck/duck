import { S, P, Normalizer, T } from '@produck/mold';
import * as Kit from '@produck/kit';
import semver from 'semver';
import version from './version.mjs';

import { createRequire } from 'node:module';


const require = createRequire(import.meta.url);
createRequire(import.meta.url)();

require();

const OptionalSemver = S.Value(semver.valid, 'semver string', () => '0.0.0');

const DuckOptionsSchema = S.Object({
	id: P.String(),
	name: P.String('Default Product Name'),
	version: OptionalSemver,
	description: P.String('No descrition'),
	components: S.Array({
		items: S.Object({
			id: P.String(),
			name: P.String(),
			version: OptionalSemver,
			description: P.String('No descrition'),
			install: P.Function(() => {}),
			created: P.Function(() => {})
		}),
		key: item => item.id
	})
});

const normalize = Normalizer(DuckOptionsSchema);
const DuckKit = Kit.global('Duck::Global');

DuckKit.duck = Object.freeze({ version });

const ProductProvider = (options, assembler = () => {}) => {
	const { id, name, version, description, components } = normalize(options);

	if (!T.Native.Function(assembler)) {
		throw new TypeError('Invalid "assembler", one "function" expected.');
	}

	const ProviderKit = DuckKit('Duck::Provider');

	ProviderKit.product = Object.freeze({
		meta: Object.freeze({ id, name, version, description }),
		components: Object.freeze(components.map(component => {
			const { id, name, version, description } = component;

			return Object.freeze({ id, name, version, description });
		}))
	});

	const InstalledKit = () => {
		const BaseProductKit = ProviderKit('Product::Base');
		const privateScope = new WeakMap();

		for (const component of components) {
			const scope = {};

			component.install(BaseProductKit, scope);
			privateScope.set(component, scope);
		}

		const InstalledProductKit = BaseProductKit('Product::Installed');

		for (const component of components) {
			component.created(InstalledProductKit, privateScope.get(component));
		}

		return InstalledProductKit;
	};

	return (...args) => assembler(InstalledKit(), ...args);
};

export { ProductProvider as Provider };
export { DuckOptionsSchema as Schema };

export const defineComponent = any => any;