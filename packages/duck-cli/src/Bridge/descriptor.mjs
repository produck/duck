import { Normalizer, P, S } from '@produck/mold';

const BridgeDescriptorSchema = S.Object({
	name: P.StringPattern(/^[A-Z][A-Za-z]*$/)('Custom'),
	bridge: P.Function(() => {}),
	commander: P.Function(() => {}),
	parse: P.Function(() => {})
});

export const normalize = Normalizer(BridgeDescriptorSchema);
export { BridgeDescriptorSchema as Schema };
