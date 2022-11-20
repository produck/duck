import { defineComponent } from '@produck/duck';
import { Custom, Normalizer, P, S } from '@produck/mold';

import * as Logger from './src/LoggerProxy.mjs';
import * as Format from './src/Format/index.mjs';
import version from './version.mjs';

const DuckLogOptionsSchema = S.Array({
	items: Logger.DescriptorSchema,
	key: item => item.name
});

const normalize = Normalizer(DuckLogOptionsSchema);

const meta = {
	id: 'org.produck.log',
	name: 'DuckLog',
	version,
	description: 'For creating log channel & recording log message.'
}

const DuckLogProvider = options => {
	const staticLoggerList = normalize(options);

	defineComponent({
		...meta,
		created: Kit => {

		}
	})
};

export { DuckLogProvider as Provider };
export { Format };