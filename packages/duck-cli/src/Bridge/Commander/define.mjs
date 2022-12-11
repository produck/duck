import * as Feature from './Feature.mjs';
import * as Descriptor from './descriptor.mjs';

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

export const TOP = Symbol.for('CLI::Command<ROOT>');

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

		async build(parentContext) {
			const context = parentContext.create(this.symbol, this.cloneFeature());

			await finalDescriptor.commander(context.proxy);

			for (const name in this.children) {
				await this.children[name].build(context);
			}
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
