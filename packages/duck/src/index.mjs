import { T, Utils } from '@produck/mold';
import * as Kit from '@produck/kit';

import * as Installation from './Installation.mjs';
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

	const NAME = `${assembler.name}ProductProxy`;

	return { [NAME]: (...args) => {
		const Kit = DefinitionKit('Duck::Product');
		let product, ready = false;

		Kit.ReadyTo = function ReadyDecorator(fn, message) {
			return { [fn.name](...args) {
				if (!ready) {
					throw new Error(message);
				}

				fn.call(this, ...args);
			} }[fn.name];
		};

		Installation.install(
			...components.map(component => next => component.install(Kit, next)),
			() => product = assembler(Kit, ...args),
		);

		ready = true;

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
