import * as Application from './Application/index.mjs';
import { Normalizer, S } from '@produck/mold';

export const Schema = S.Array({
	items: Application.Options.Schema,
	key: _ => _.id
});

export const normalize = Normalizer(Schema);
