import { PROPERTY, S, P, Normalizer } from '@produck/mold';

export const Schema = S.Object({
	root: P.String(process.cwd()),
	[PROPERTY]: P.String(),
});

export const normalize = Normalizer(Schema);
