import { Custom, Normalizer, P, S } from '@produck/mold';

const HEAD_LEVEL = 'info';
const LEVELS = ['trace', 'debug', HEAD_LEVEL, 'warn', 'error', 'fatal'];

export const SimpleConsoleTranscriber = () => {
	const log = console.log.bind(console);

	return (label, level, date, message) =>
		log(label, level, date.toISOString(), message);
};

export const OptionsSchema = S.Object({
	Transcriber: P.Function(SimpleConsoleTranscriber),
	label: P.String(),
	levels: Custom(S.Object({
		sequence: S.Array({
			items: P.String(),
			minLength: 1,
			key: item => item
		}, () => [...LEVELS]),
		head: P.String(HEAD_LEVEL),
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
	})
});

export const normalize = Normalizer(OptionsSchema);