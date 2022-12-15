import { Normalizer, P, S } from '@produck/mold';

export const Schema = S.Object({
	id: P.String(),
	provider: P.Function(),
	description: P.String('No description.')
});

export const normalize = Normalizer(Schema);
