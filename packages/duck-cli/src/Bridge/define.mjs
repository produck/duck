import * as Provider from './provider.mjs';
import { Context } from './Context.mjs';
import { Commander } from './Commander.mjs';

export const defineCommander = (provider) => {
	const finalProvider = Provider.normalize(provider);
	const CLASS_NAME = `${finalProvider.name}Commander`;

	const CustomCommander = { [CLASS_NAME]: class extends Commander {
		async buildProgram() {
			const context = new Context(null, this.symbol, this.feature);

			await finalProvider.program(context.proxy);
			await this.buildChildren(context);
		}

		async build(parentContext) {
			const context = parentContext.create(this.symbol, this.feature);

			await finalProvider.commander(context.proxy);
			await this.buildChildren(context);
		}

		async parse() {
			const build = async () => await this.buildProgram();

			await finalProvider.parse(context.proxy, build);
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
