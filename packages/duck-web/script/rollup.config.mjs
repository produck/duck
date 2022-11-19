import { createRequire } from 'node:module';
import path from 'node:path';

import { defineConfig } from 'rollup';

const require = createRequire(import.meta.url);
const meta = require('../package.json');

const BANNER =
	'/*!\n' +
	` * ${meta.name} v${meta.version}\n` +
	` * (c) 2018-${new Date().getFullYear()} ChaosLee\n` +
	` * Released under the ${meta.license} License.\n` +
	' */';

const moduleList = [
	{
		output: path.resolve('index.cjs'),
		format: 'cjs',
		isExternal: true,
	}
];

export default moduleList.map(config => {
	return defineConfig({
		input: path.resolve('index.mjs'),
		output: {
			file: config.output,
			format: config.format,
			name: config.name,
			banner: BANNER
		},
		external: [
			...Object.keys(meta.dependencies),
			/^node:/
		]
	});
});
