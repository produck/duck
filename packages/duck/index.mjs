import { S, P, Normalizer } from '@produck/mold';
import * as Kit from '@produck/kit';
import version from './version.mjs';

const DuckComponentSchema = S.Object({
	id: P.String(),
	name: P.String(),
	description: P.String('No descrition'),
	install: P.Function(),
	created: P.Function(() => {}),
	getDetails: P.Function(() => null)
});

const DuckOptionsSchema = S.Object({
	id: P.String(),
	name: P.String('Default Produck Name'),
	namespace: P.String(),
	version: P.String('0.0.0'),
	description: P.String('No descrition'),
	components: S.Array(DuckComponentSchema)
});

const normalize = Normalizer(DuckOptionsSchema);
const DuckKit = Kit.global('Duck');

DuckKit.duck = Object.freeze({ version });

const ProductProvider = (options, assembler = () => {}) => {
	const finalOptions = normalize(options);

	const product = Object.freeze({
		meta: Object.freeze({
			id: finalOptions.id,
			name: finalOptions.name,
			version: finalOptions.version,
			namespace: finalOptions.namespace,
			description: finalOptions.description
		}),
		get components() {
			return finalOptions.components.map(component => {
				return {
					id: component.id,
					name: component.name,
					version: component.version,
					description: component.description,
					details: component.getDetails()
				};
			});
		}
	});

	const InstalledKit = () => {
		const BaseKit = DuckKit('Duck::Instance::Base');

		BaseKit.product = product;

		for (const component of finalOptions.components) {
			component.install(BaseKit);
		}

		const InstalledKit = BaseKit('Duck::Instance::Installed');

		for (const component of finalOptions.components) {
			component.created(InstalledKit);
		}

		return InstalledKit;
	};

	return (...args) => new assembler(InstalledKit(), ...args);
};

export default ProductProvider;
export { ProductProvider as Duck };