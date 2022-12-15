import { T, Utils } from '@produck/mold';
import * as Kit from '@produck/kit';

import * as Options from './Options.mjs';
import version from './version.mjs';

const DuckKit = Kit.global('Duck');

DuckKit.duck = Object.freeze({ version });

export const defineProduct = (options = {}, assembler = Kit => Kit) => {
	const { id, name, version, description, components } = Options.normalize(options);

	if (!T.Native.Function(assembler)) {
		Utils.throwError('assembler', 'function');
	}

	const DefinitionKit = DuckKit('Duck::Definition');

	DefinitionKit.product = Object.freeze({
		meta: Object.freeze({ id, name, version, description }),
		components: Object.freeze(components.map(component => {
			const { id, name, version, description } = component;

			return Object.freeze({ id, name, version, description });
		})),
	});

	const ProductKit = () => {
		const Kit = DefinitionKit('Duck::Product');

		for (const component of components) {
			component.install(Kit);
		}

		return Kit;
	};

	return (...args) => assembler(ProductKit(), ...args);
};

export const defineAny = any => any;

export {
	Options,
	defineProduct as define,
	defineAny as defineComponent,
};
