import { Normalizer, P, S } from '@produck/mold';

export const BuilderSchema = S.Object({
	program: P.Function(),
	commander: P.Function(),
	parse: P.Function(),
}, 'builder');

export const Schame = S.Object({
	name: P.StringPattern(/^[A-Z][A-Za-z]*$/)('Custom'),
	Builder: P.Function(),
});

export const normalize = Normalizer(Schame);
export const normalizeBuilder = Normalizer(BuilderSchema);
