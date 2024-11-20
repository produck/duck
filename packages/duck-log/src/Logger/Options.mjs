import * as Ow from '@produck/ow';
import { Custom, Normalizer, P, S, T } from '@produck/mold';

const HEAD = 'info';
const LEVELS = ['trace', 'debug', HEAD, 'warn', 'error', 'fatal'];

export const SimpleConsoleTranscriber = () => {
	const log = console.log.bind(console);

	return (label, level, date, message) => {
		const msg = T.Native.Object(message) ? JSON.stringify(message) : message;

		log(`[${date.toISOString()}] [${level.toUpperCase()}] [${label}]: ${msg}`);
	};
};

export const Schema = S.Object({
	Transcriber: P.Function(SimpleConsoleTranscriber),
	label: P.String(),
	level: Custom(S.Object({
		head: P.String(HEAD),
		sequence: S.Array({
			items: P.String(),
			minLength: 1,
			key: item => item,
		}, () => [...LEVELS]),
		prevents: S.Array({ items: P.String() }),
	}), (_value, _empty, next) => {
		const options = next();

		if (!options.sequence.includes(options.head)) {
			Ow.Error.Common('Level head MUST be one member of levels list.');
		}

		for (const [index, level] of options.prevents.entries()) {
			if (!options.sequence.includes(level)) {
				Ow.Error.Common(`The level(${level}) at [${index}] is NOT a member.`);
			}
		}

		return options;
	}),
}, 'logger descriptor');

export const DEFAULT_LEVELS = Object.freeze([...LEVELS]);
export const normalize = Normalizer(Schema);
