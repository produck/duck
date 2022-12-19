import * as Provider from './provider.mjs';
import { Context } from './Context.mjs';
import { Commander } from './Commander.mjs';

export const defineCommander = (provider) => {
	const finalProvider = Provider.normalize(provider);
	const CLASS_NAME = `${finalProvider.name}Commander`;

	const CustomCommander = { [CLASS_NAME]: class extends Commander {
		async build(parentContext, builder) {
			const context = parentContext.create(this.symbol, this.feature);

			await builder.commander(context.proxy);
			await this.buildChildren(context);
		}

		async parse() {
			const builder = finalProvider.Builder();
			const context = new Context(null, this.symbol, this.feature);

			await builder.program(context.proxy);
			await this.buildChildren(context, builder);
			await builder.parse();
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
