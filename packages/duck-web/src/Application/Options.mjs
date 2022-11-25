import { Normalizer, P, S } from '@produck/mold';

const ApplicationDescriptorSchema = S.Object({
	id: P.String(),
	Provider: P.Function(),
	description: P.String('No description.')
});

export const normalize = Normalizer(ApplicationDescriptorSchema);
export { ApplicationDescriptorSchema as Schema };