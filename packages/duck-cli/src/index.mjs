import { defineComponent } from '@produck/duck';

import version from './version.mjs';

const meta = defineComponent({
	id: 'org.produck.duck.cli',
	name: 'DuckCLI',
	version,
	description: ''
});

const DuckCLIProvider = options => {
	return defineComponent({
		...meta,
		created: Kit => {

		}
	});
};
