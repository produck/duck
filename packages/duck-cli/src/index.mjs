import { defineComponent, define } from '@produck/duck';

import version from './version.mjs';
import * as CLI from './CLI.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.cli',
	name: 'DuckCLI',
	version,
	description: ''
});

const DuckCLIProvider = (options, Descriptor) => {
	return defineComponent({
		...meta,
		created: InstalledKit => {
			const CLIKit = InstalledKit('DuckCLI');
			const descriptor = Descriptor(CLIKit);
			const CustomCLI = CLI.define(descriptor);

			const cli = new CustomCLI();
			const parse = async () => await cli.parse();

			InstalledKit.CLI = Object.freeze({ parse });
		}
	});
};

export {
	DuckCLIProvider as Provider,
	define as defineDescriptor,
	define as defineOptions,
};
