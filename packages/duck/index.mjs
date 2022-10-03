import { S, P, Normalizer, T } from '@produck/mold';
import * as Kit from '@produck/kit';
import semver from 'semver';
import version from './version.mjs';

const OptionalSemver = S.Value(semver.valid, 'semver string', () => '0.0.0');

const DuckOptionsSchema = S.Object({
	id: P.String(),
	name: P.String('Default Produck Name'),
	version: OptionalSemver,
	description: P.String('No descrition'),
	components: S.Array({
		items: S.Object({
			id: P.String(),
			name: P.String(),
			version: OptionalSemver,
			description: P.String('No descrition'),
			install: P.Function(() => {}),
			created: P.Function(() => {}),
			details: P.Function(() => null)
		}),
		key: item => item.id
	})
});

const normalize = Normalizer(DuckOptionsSchema);
const DuckKit = Kit.global('Duck');

DuckKit.duck = Object.freeze({ version });

const ProductProvider = (options, assembler = () => {}) => {
	const finalOptions = normalize(options);

	if (!T.Native.Function(assembler)) {
		throw new TypeError('Invalid "assembler", one "function" expected.');
	}

	const ProviderKit = DuckKit('Duck::Provider');

	ProviderKit.product = Object.freeze({
		meta: Object.freeze({
			id: finalOptions.id,
			name: finalOptions.name,
			version: finalOptions.version,
			description: finalOptions.description
		}),
		components: Object.freeze(finalOptions.components.map(component => {
			return Object.freeze({
				id: component.id,
				name: component.name,
				version: component.version,
				description: component.description
			});
		}))
	});

	const InstalledKit = () => {
		const BaseProduckKit = ProviderKit('Duck::Produck::Base');

		for (const component of finalOptions.components) {
			component.install(BaseProduckKit);
		}

		const InstalledProduckKit = BaseProduckKit('Duck::Produck::Installed');

		for (const component of finalOptions.components) {
			component.created(InstalledProduckKit);
		}

		return InstalledProduckKit;
	};

	return (...args) => new assembler(InstalledKit(), ...args);
};

export { ProductProvider as Duck };

export const defineComponent = any => any;