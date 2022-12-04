import { Custom, Normalizer, P, S } from '@produck/mold';

const HEAD = 'info';
const LEVELS = Object.freeze(['trace', 'debug', HEAD, 'warn', 'error', 'fatal']);

export const SimpleConsoleTranscriber = () => {
	const log = console.log.bind(console);

	return (label, level, date, message) =>
		log(label, level, date.toISOString(), message);
};

const OptionsSchema = S.Object({
	Transcriber: P.Function(SimpleConsoleTranscriber),
	label: P.String(),
	level: Custom(S.Object({
		head: P.String(HEAD),
		sequence: S.Array({
			items: P.String(),
			minLength: 1,
			key: item => item
		}, () => [...LEVELS]),
		prevents: S.Array({ items: P.String() })
	}), (_value, _empty, next) => {
		const levelOptions = next();

		if (levelOptions.head === '') {
			levelOptions.head = levelOptions.sequence[0];
		}

		if (!levelOptions.sequence.includes(levelOptions.head)) {
			throw new Error('Level head MUST be one member of levels list.');
		}

		for (const [index, level] of levelOptions.prevents.entries()) {
			if (!levelOptions.sequence.includes(level)) {
				throw new Error(`The level(${level}) at [${index}] is NOT a member.`);
			}
		}

		return levelOptions;
	})
});

export const DEFAULT_LEVELS = LEVELS;
export const normalize = Normalizer(OptionsSchema);
export { OptionsSchema as Schema };
