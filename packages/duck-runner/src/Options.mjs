import { Normalizer, P, PROPERTY, S } from '@produck/mold';
import * as Template from './Template/index.mjs';

export const Schema = S.Object({
	/**
	 * All modes.
	 */
	modes: S.Object({
		[PROPERTY]: P.Function(),
	}, () => ({
		solo: Template.Solo(),
		processes: Template.Processes(),
	})),
	/**
	 * All roles.
	 */
	roles: S.Object({
		[PROPERTY]: P.Function(),
	}),
});

export const normalize = Normalizer(Schema);
