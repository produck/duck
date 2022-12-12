import { defineComponent, define } from '@produck/duck';

import version from './version.mjs';
import * as Bridge from './Bridge/index.mjs';
import * as Options from './Options.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.cli',
	name: 'DuckCLI',
	version,
	description: ''
});

const DuckCLIProvider = (feature, provider) => {
	const finalDescriptor = Bridge.Provider.normalize(provider);
	const CustomCommander = Bridge.define(finalDescriptor);
	const staticFeature = Options.normalizeFeature(feature);

	return defineComponent({
		...meta,
		created: InstalledKit => {
			const CLIKit = InstalledKit('DuckCLI');

			const Commander = (feature) => {
				return new CustomCommander(Bridge.Feature.normalize(feature));
			};

			const append = (path, feature) => {
				const parent = select(path);
				const child = Commander(feature);

				parent.appendChild(child);

				return child;
			};

			const select = path => top.select(path);
			const parse = async () => await top.parse();

			const top = (function compile(feature) {
				const commander = Commander({
					name: feature.name,
					description: feature.description,
					aliases: feature.aliases,
					options: feature.options,
					arguments: feature.arguments,
					handler: feature.Handler(CLIKit),
				});

				for (const childFeature of feature.children) {
					commander.appendChild(compile(childFeature));
				}

				return commander;
			})(staticFeature);

			InstalledKit.CLI = Object.freeze({ parse, Commander, select, append });
		}
	});
};

export {
	DuckCLIProvider as Provider,
	define as defineProvider,
	define as defineFeature,
};
