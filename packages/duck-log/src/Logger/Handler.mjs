import * as Options from './Options.mjs';

const IGNORE = () => {};
export const MODIFIER = Symbol.for('DUCKLOG_LOGGER_MODIFIER');

const assertLevelExisted = (proxy, level) => {
	if (!proxy.hasLevel(level)) {
		throw new Error('Can NOT access a non-existed level.');
	}
};

const LoggerProxy = handler => {
	const logByHeadLevel = (...args) => handler.recorders[handler.head](...args);

	logByHeadLevel[MODIFIER] = {
		get levels() {
			return handler.levels;
		},
		hasLevel: level => handler.hasLevel(level),
		isPrevent: level => handler.isPrevent(level),
		preventOne: level => handler.preventOne(level),
		preventTo: level => handler.preventTo(level),
		setHead: level => handler.setHead(level),
	};

	return new Proxy(logByHeadLevel, {
		get: (_target, level) => {
			if (!handler.hasLevel(level)) {
				throw new Error(`Missing level(${level}).`);
			}

			return handler.recorders[level];
		},
		set: () => {
			throw new Error('Illegal setting property.');
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

		for (const level of Level.sequence) {
			Level.recorders[level] = function record(message) {
				sharedDate.setTime(Date.now());
				transcribe(label, level, sharedDate, message);
			};
		}

		level.prevents.forEach(level => this.preventOne(level));

		this.recorders = { /** Formal or IGNORE */ };
		this.head = level.head;
		this.proxy = LoggerProxy(this);
	}

	get levels() {
		return [...this.Level.sequence];
	}

	hasLevel(level) {
		return Object.hasOwn(this.recorders, level);
	}

	isPrevent(level) {
		assertLevelExisted(this, level);

		return this.recorders[level] === IGNORE;
	}

	preventOne(level) {
		assertLevelExisted(this, level);
		this.Level.recorders[level] = IGNORE;
	}

	preventTo(level) {
		assertLevelExisted(this, level);

		let matched = false;

		for (const _level of this.Level.sequence) {
			if (!matched) {
				matched = level === _level;
			}

			this.recorders[_level] = matched ? this.Level.recorders[_level] : IGNORE;
		}
	}

	setHead(level) {
		assertLevelExisted(this, level);

		return this.head = level;
	}
}
