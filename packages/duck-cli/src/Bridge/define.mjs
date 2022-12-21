import { Normalizer, P, S } from '@produck/mold';

import * as Provider from './provider.mjs';
import { Context } from './Context.mjs';
import { Commander } from './Commander.mjs';

export const ArgvSchema = S.Array({ items: P.String() }, 'string[]');
export const normalizeArgv = Normalizer(ArgvSchema);

const assertBuilder = any => Provider.normalizeBuilder(any);

export const defineCommander = (provider) => {
	const finalProvider = Provider.normalize(provider);
	const { name, Builder } = finalProvider;
	const CLASS_NAME = `${name}Commander`;

	assertBuilder(Builder());

	const CustomCommander = { [CLASS_NAME]: class extends Commander {
		async buildChildren(context, builder) {
			for (const commander of this.children) {
				await commander.build(context, builder);
			}
		}

		async build(parentContext, builder) {
			const context = parentContext.create(this.symbol, this.feature);

			await builder.commander(context.proxy);
			await this.buildChildren(context, builder);
		}

		async parse(argv) {
			const finalArgv = normalizeArgv(argv);
			const builder = Builder();
			const context = new Context(null, this.symbol, this.feature);

			await builder.program(context.proxy);
			await this.buildChildren(context, builder);
			await builder.parse(finalArgv);
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
