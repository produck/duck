import * as Feature from './Feature.mjs';
import * as Descriptor from './descriptor.mjs';
import { Context } from './Context.mjs';

export const TOP = Symbol.for('CLI::Command<ROOT>');

class Commander {
	constructor(feature) {
		const finalFeature = Feature.normalize(feature);

		this.symbol = Symbol(`CLI::Command<${finalFeature.name}>`);
		this.feature = finalFeature;
		this.children = {};
	}

	has(childName) {
		return Object.hasOwn(this.children, childName);
	}

	cloneFeature() {
		return Feature.normalize(this.feature);
	}
}

export const defineCommander = (descriptor) => {
	const finalDescriptor = Descriptor.normalize(descriptor);
	const CLASS_NAME = `${finalDescriptor.name}Commander`;

	const CustomCommander = { [CLASS_NAME]: class extends Commander {
		appendChild(feature) {
			const finalFeature = Feature.normalize(feature);

			if (this.has(finalFeature.name)) {
				throw new Error('Duplicated child commander name.');
			}

			const childCommander = new CustomCommander(finalFeature);

			this.children[childCommander.feature.name] = childCommander;
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

		async buildProgram() {
			const context = new Context(null, this.symbol, this.cloneFeature());

			await finalDescriptor.program(context.proxy);
			await this.buildChildren(context);
		}

		async build(parentContext) {
			const context = parentContext.create(this.symbol, this.cloneFeature());

			await finalDescriptor.commander(context.proxy);
			await this.buildChildren(context);
		}

		async buildChildren(context) {
			for (const name in this.children) {
				await this.children[name].build(context);
			}
		}

		async parse() {
			const build = async () => await this.buildProgram();

			await finalDescriptor.parse(context.proxy, build);
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
