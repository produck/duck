import { T, Utils } from '@produck/mold';
import * as Kit from '@produck/kit';

import * as Options from './Options.mjs';
import version from './version.mjs';

const DuckKit = Kit.global('Duck::Global');

DuckKit.duck = Object.freeze({ version });

const ProductProvider = (options = {}, assembler = Kit => Kit) => {
	const { id, name, version, description, components } = Options.normalize(options);

	if (!T.Native.Function(assembler)) {
		Utils.throwError('assembler', 'function');
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

		for (const component of components) {
			component.install(BaseProductKit);
		}

		const InstalledProductKit = BaseProductKit('Product::Installed');

		for (const component of components) {
			component.created(InstalledProductKit);
		}

		return InstalledProductKit;
	};

	return (...args) => assembler(InstalledKit(), ...args);
};

export const defineAny = any => any;

export {
	Options,
	ProductProvider as define,
	defineAny as defineComponent,
};
