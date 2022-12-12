import { Normalizer, T, Utils } from '@produck/mold';
import * as Feature from './Feature.mjs';

const normalizeOption = Normalizer(Feature.OptionSchema);
const normalizeArgument = Normalizer(Feature.ArgumentSchema);

export class Commander {
	constructor(feature) {
		const finalFeature = Feature.normalize(feature);

		this.symbol = Symbol(`CLI::Command<${finalFeature.name}>`);
		this.feature = finalFeature;
		this.children = {};
	}

	setAlias(name) {
		if (!T.Native.String(name)) {
			Utils.throwError('alias name', 'unique string');
		}

		if (this.feature.alias.includes(name)) {
			throw new Error('Duplicated alias of this commander.');
		}

		this.feature.alias.push(name);
	}

	setOption(option) {
		const finalOption = normalizeOption(option);

		if (Object.hasOwn(this.feature.options, finalOption.name)) {
			throw new Error();
		}

		this.feature.options[finalOption.name] = finalOption;
	}

	setArgument(argument) {
		const finalArgument = normalizeArgument(argument);

		this.feature.arguments.push(finalArgument);
	}

	has(childName) {
		return Object.hasOwn(this.children, childName);
	}

	select(commanderPath) {
		const list = commanderPath.split('.');
		const finding = [''];

		let target = this;

		while (list.length > 0) {
			const currentName = list.shift();

			finding.push(currentName);

			if (!target.has(currentName)) {
				throw new Error(`Command "${finding.join(' ')}" is NOT found.`);
			}
		}

		return target;
	}

	cloneFeature() {
		return Feature.normalize(this.feature);
	}

	async buildChildren(context) {
		for (const name in this.children) {
			await this.children[name].build(context);
		}
	}
}
