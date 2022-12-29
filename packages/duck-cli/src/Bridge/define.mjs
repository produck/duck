import { Normalizer, P, S } from '@produck/mold';

import * as Provider from './provider.mjs';
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
		async buildChildren(builder) {
			for (const commander of this.children) {
				await commander.build(builder);
			}
		}

		async build(builder) {
			await builder.commander(this.options);
			await this.buildChildren(builder);
		}

		async parse(argv) {
			const finalArgv = normalizeArgv(argv);
			const builder = Builder();

			await builder.program(this.options);
			await this.buildChildren(builder);
			await builder.parse(finalArgv);
		}
	} }[CLASS_NAME];

	return CustomCommander;
};
