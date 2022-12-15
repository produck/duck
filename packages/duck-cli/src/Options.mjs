import { Circ, Normalizer, P, PROPERTY, S } from '@produck/mold';
import * as Bridge from './Bridge/index.mjs';

export const FeatureSchema = Circ(SelfSchema => S.Object({
	name: P.String(),
	description: P.String(''),
	aliases: S.Array({ items: P.String(), key: _ => _ }),
	options: S.Object({ [PROPERTY]: Bridge.Feature.OptionSchema }),
	arguments: S.Array({ items: Bridge.Feature.ArgumentSchema, key: _ => _.name }),
	Handler: P.Function(() => () => {}),
	children: S.Array({ items: SelfSchema }),
}));

export const normalizeFeature = Normalizer(FeatureSchema);
