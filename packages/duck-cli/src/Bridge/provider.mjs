import { Normalizer, P, S } from '@produck/mold';

export const Schame = S.Object({
	name: P.StringPattern(/^[A-Z][A-Za-z]$/)('Custom'),
	program: P.Function(() => {}),
	commander: P.Function(() => {}),
	parse: P.Function(() => {}),
});

export const normalize = Normalizer(Schame);
