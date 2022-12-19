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

const DuckCLIProvider = (factory, provider) => {
	if (T.Native.Function(factory)) {
		U.throwError('factory', 'function');
	}

	const finalProvider = Bridge.Provider.normalize(provider);
	const CustomCommander = Bridge.define(finalProvider);

	return defineComponent({
		...meta,
		install: Kit => {
			Kit.CLI = Object.freeze({
				parse: async () => {
					const CLIKit = Kit('DuckCLI');

					CLIKit.Commander = CustomCommander;

					await factory(CLIKit).parse();
				},
			});
		},
	});
};

export {
	DuckCLIProvider as Provider,
	defineAny as defineProvider,
	defineAny as defineFeature,
};
