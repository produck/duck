import { T, U } from '@produck/mold';
import { defineComponent, defineAny } from '@produck/duck';

import version from './version.mjs';
import * as Bridge from './Bridge/index.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.cli',
	name: 'DuckCLI',
	version,
	description: '',
});

const DuckCLIComponent = (factory, provider) => {
	if (!T.Native.Function(factory)) {
		U.throwError('factory', 'function');
	}

	const finalProvider = Bridge.Provider.normalize(provider);
	const CustomCommander = Bridge.define(finalProvider);

	return defineComponent({
		...meta,
		install: Kit => {
			const parse = async (argv = process.argv.slice(2)) => {
				const CLIKit = Kit('DuckCLI');
				const context = { program: null };

				CLIKit.Commander = CustomCommander;

				CLIKit.setProgram = (commander) => {
					if (!(commander instanceof Bridge.Commander)) {
						U.throwError('program', 'commander');
					}

					context.program = commander;
				};

				factory(CLIKit);

				if (context.program === null) {
					throw new Error('Program is NOT defined.');
				}

				await context.program.parse(argv);
			};

			Kit.CLI = Object.freeze({ parse });
		},
	});
};

export {
	Bridge,
	DuckCLIComponent as Component,
	defineAny as defineProvider,
	defineAny as defineFeature,
	defineAny as defineFactory,
};
