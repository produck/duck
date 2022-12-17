import { Normalizer, P, PROPERTY, S } from '@produck/mold';

export const Schema = S.Object({
	/**
	 * All modes.
	 */
	modes: S.Object({ [PROPERTY]: P.Function() }),
	/**
	 * All roles.
	 */
	roles: S.Object({ [PROPERTY]: P.Function() }),
});

export const normalize = Normalizer(Schema);
