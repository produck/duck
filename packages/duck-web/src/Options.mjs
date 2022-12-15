import { Normalizer, S, P } from '@produck/mold';

export const DescriptorSchema = S.Object({
	id: P.String(),
	provider: P.Function(),
	description: P.String('No description.'),
});

export const Schema = S.Array({
	items: DescriptorSchema,
	key: _ => _.id,
});

export const normalize = Normalizer(Schema);
export const normalizeDescriptor = Normalizer(DescriptorSchema);
