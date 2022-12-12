import { Normalizer, P, S } from '@produck/mold';

const CommanderDescriptorSchema = S.Object({
	name: P.StringPattern(/^[A-Z][A-Za-z]*$/)('Custom'),
	program: P.Function(() => {}),
	commander: P.Function(() => {}),
	parse: P.Function(() => {})
});

export const normalize = Normalizer(CommanderDescriptorSchema);
export { CommanderDescriptorSchema as Schema };
