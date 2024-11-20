import * as Ow from '@produck/ow';
import { Assert } from '@produck/idiom';

import * as Options from './Options.mjs';

const IGNORE = () => {};
export const MODIFIER = Symbol.for('DUCKLOG_LOGGER_MODIFIER');

const LoggerProxy = handler => {
	const { recorders, head } = handler;
	const logByHeadLevel = (message) => recorders[head](message);

	Object.freeze(logByHeadLevel);

	return new Proxy(logByHeadLevel, {
		get: (_target, level) => {
			if (level === MODIFIER) {
				return handler;
			}

			if (!handler.hasLevel(level)) {
				Ow.Error.Common(`Missing level(${level}).`);
			}

			return recorders[level];
		},
	});
};

export class LoggerHandler {
	constructor(options) {
		const { label, level, Transcriber } = Options.normalize(options);
		const sharedDate = new Date();

		const Level = this.Level = {
			sequence: [...level.sequence],
			recorders: { /** Formal */ },
		};

		const transcribe = Transcriber(label, level.sequence);

		Assert.Type.Function(transcribe, '.Transcriber', '() => Function');

		this.recorders = { /** Formal or IGNORE */ };
		this.head = level.head;
		this.proxy = LoggerProxy(this);

		for (const level of Level.sequence) {
			const record = function record(message) {
				sharedDate.setTime(Date.now());
				transcribe(label, level, sharedDate, message);
			};

			Level.recorders[level] = record;
			this.recorders[level] = record;
		}

		level.prevents.forEach(level => this.prevent(level));
	}

	get levels() {
		return [...this.Level.sequence];
	}

	hasLevel(level) {
		return Object.hasOwn(this.recorders, level);
	}

	assertLevel(level) {
		Assert.Type.String(level, 'level');

		if (!this.hasLevel(level)) {
			Ow.Error.Common(`Can NOT access a non-existed level(${level}).`);
		}
	}

	isPrevent(level) {
		this.assertLevel(level);

		return this.recorders[level] === IGNORE;
	}

	resume(level) {
		this.assertLevel(level);
		this.recorders[level] = this.Level.recorders[level];
	}

	prevent(level) {
		this.assertLevel(level);
		this.recorders[level] = IGNORE;
	}

	preventTo(level) {
		this.assertLevel(level);

		let matched = false;

		for (const _level of this.Level.sequence) {
			if (!matched) {
				matched = level === _level;
			}

			this.recorders[_level] = matched ? this.Level.recorders[_level] : IGNORE;
		}
	}

	setHead(level) {
		this.assertLevel(level);

		return this.head = level;
	}
}
