import { T, Utils } from '@produck/mold';
import * as Kit from '@produck/kit';
import { compose } from '@produck/compose';

import * as Options from './Options.mjs';
import version from './version.mjs';

const DuckKit = Kit.global('Duck');

DuckKit.duck = Object.freeze({ version });

export const defineProduct = (options = {}, assembler = Kit => Kit) => {
	const { components, ...meta } = Options.normalize(options);

	if (!T.Native.Function(assembler)) {
		Utils.throwError('assembler', 'function');
	}

	const DefinitionKit = DuckKit('Duck::Definition');
	const installList = [];

	DefinitionKit.product = Object.freeze({
		meta: Object.freeze(meta),
		components: Object.freeze(components.map(component => {
			const { install, ...meta } = component;

			installList.push(install);

			return Object.freeze(meta);
		})),
	});

	const NAME = `${assembler.name}ProductProxy`;

	return { [NAME]: (...args) => {
		const Kit = DefinitionKit('Duck::Product');
		let product;

		compose(...installList, () => product = assembler(Kit, ...args))(Kit);

		return product;
	} }[NAME];
};

export const defineAny = any => any;

export {
	Options,
	defineProduct as define,
	defineAny as defineComponent,
	defineAny as inject,
};
