import { T, U } from '@produck/mold';
import * as Feature from './Feature.mjs';

const assertCommanderName = any => {
	if (!T.Native.String(any)) {
		U.throwError('name', 'string');
	}
};

export class Commander {
	constructor(feature) {
		this.symbol = Symbol('Commander');
		this.feature = Feature.normalize(feature);

		this.parent = null;
		this.children = [];
		this.defaultChild = null;
	}

	get name() {
		return this.feature.name;
	}

	get options() {
		return {
			feature: this.feature,
			isDefault: this.isDefault,
		};
	}

	get isDefault() {
		return this.parent !== null && this.parent.defaultChild === this;
	}

	hasChild(name) {
		assertCommanderName(name);

		return this.children.some(commander => commander.name === name);
	}

	setDefaultChild(name) {
		assertCommanderName(name);

		const child = this.children.find(commander => commander.name === name);

		if (child === undefined) {
			throw new Error(`No child(${name})`);
		}

		this.defaultChild = child;
	}

	appendChild(commander, asDefault = false) {
		if (!(commander instanceof Commander)) {
			U.throwError('commander', 'Commander');
		}

		if (!T.Native.Boolean(asDefault)) {
			U.throwError('asDefault', 'boolean');
		}

		const newChildName = commander.name;

		for (const childCommander of this.children) {
			const existedName = childCommander.name;

			if (existedName === newChildName) {
				throw new Error(`Duplicated child commander(${newChildName}).`);
			}

			for (const alias of commander.feature.aliases) {
				if (childCommander.feature.aliases.includes(alias)) {
					throw new Error(`Duplicated alias(${alias}) in commander(${existedName})`);
				}
			}
		}

		this.children.push(commander);
		commander.parent = this;

		if (asDefault) {
			this.setDefaultChild(newChildName);
		}
	}
}
