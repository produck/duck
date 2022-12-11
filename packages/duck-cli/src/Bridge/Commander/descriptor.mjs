import { Normalizer, P, S } from '@produck/mold';

const CommanderDescriptorSchema = S.Object({
	name: P.StringPattern(/^[A-Z][A-Za-z]*$/)('Custom'),
	commander: P.Function(() => {})
});

export const normalize = Normalizer(CommanderDescriptorSchema);
export { CommanderDescriptorSchema as Schema };
