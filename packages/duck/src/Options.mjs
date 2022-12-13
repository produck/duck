import { S, P, Normalizer } from '@produck/mold';
import semver from 'semver';

const OptionalSemver = S.Value(semver.valid, 'semver string', () => '0.0.0');

export const ComponentSchema = S.Object({
	id: P.String(),
	name: P.String(),
	version: OptionalSemver,
	description: P.String('No descrition'),
	install: P.Function(() => {}),
	created: P.Function(() => {}),
});

export const Schema = S.Object({
	id: P.String(),
	name: P.String('Default Product Name'),
	version: OptionalSemver,
	description: P.String('No descrition'),
	components: S.Array({ items: ComponentSchema, key: _ => _.id }),
}, 'options object');

export const normalize = Normalizer(Schema);
