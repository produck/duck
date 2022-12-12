import * as Descriptor from './provider.mjs';
import { Context } from './Context.mjs';
import { Commander } from './Commander.mjs';

export const TOP = Symbol.for('CLI::Command<ROOT>');

export const defineCommander = (descriptor) => {
	const finalDescriptor = Descriptor.normalize(descriptor);
	const CLASS_NAME = `${finalDescriptor.name}Commander`;

	const CustomCommander = { [CLASS_NAME]: class extends Commander {
		appendChild(commander) {
			if (this.has(commander.name)) {
				throw new Error('Duplicated child commander name.');
			}

			this.children[commander.feature.name] = commander;
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

		async parse() {
			const build = async () => await this.buildProgram();

			await finalDescriptor.parse(context.proxy, build);
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
