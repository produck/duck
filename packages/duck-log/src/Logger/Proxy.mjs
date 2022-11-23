import * as Options from './Options.mjs';

const BLOCKER = () => {};

const assertLevelExisted = (proxy, level) => {
	if (!proxy.hasLevel(level)) {
		throw new Error('Can NOT access a non-existed level.');
	}
};

export class DuckCategoryLogger {
	constructor(options) {
		const { label, levels, Transcriber } = Options.normalize(options);
		const sharedDate = new Date();

		const Level = this.Level = {
			sequence: [...levels.sequence],
			// All formal recorder by level
			recorders: {}
		};

		// Active recorder & MUTE
		const recorders = this.recorders = {};

		for (const level of Level.sequence) {
			const recorder = Level.recorders[level] = message => {
				sharedDate.setTime(Date.now());
				transcribe(label, level, sharedDate, message);
			};

			recorders[level] = levels.prevents.includes(level) ? BLOCKER : recorder;
		}

		const transcribe = Transcriber(label, levels);

		this.head = levels.head;
	}

	get levels() {
		return [...this.Level.sequence];
	}

	hasLevel(level) {
		return this.Level.sequence.includes(level);
	}

	isPrevent(level) {
		assertLevelExisted(this, level);

		return this.recorders[level] === BLOCKER;
	}

	preventOne(level) {
		assertLevelExisted(this, level);
		this.Level.recorders[level] = BLOCKER;
	}

	preventTo(level) {
		assertLevelExisted(this, level);

		let matched = false;

		for (const _level of this.Level.sequence) {
			if (!matched) {
				matched = level === _level;
			}

			this.recorders[_level] = matched ? this.Level.recorders[_level] : BLOCKER;
		}
	}

	setHead(level) {
		assertLevelExisted(this, level);

		return this.head = level;
	}
}