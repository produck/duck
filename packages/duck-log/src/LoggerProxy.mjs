import { Custom, Normalizer, P, S } from '@produck/mold';
import * as Provider from './Provider/index.mjs';

const OptionsSchema = Custom(S.Object({
	type: P.String('duck'),
	label: P.String(),
	levels: S.Array({ items: P.String(), minLength: 1, key: symbol => symbol }),
	defaultLevel: P.String(),
	preventLevels: S.Array({ items: P.String() })
}), (_value, _empty, next) => {
	const value = next();

	// default

	// prevent
});

const normalize = Normalizer(OptionsSchema);

const MUTE = () => {};

const addLevelLogger = (proxy, level) => {
	const { label, sharedDate, logger } = proxy;

	return message => {
		sharedDate.setTime(Date.now());
		logger(label, level, sharedDate, message);
	};
};

const assertLevelExisted = (proxy, level) => {
	if (!proxy.hasLevel(level)) {
		throw new Error('Can NOT access a non-existed level.');
	}
};

class DuckCategoryLoggerProxy {
	constructor(options) {
		const finalOptions = normalize(options);

		this.label = finalOptions.label;
		this.levelLoggerRegistry = {};
		this.preventLevels = {};
		this.sharedDate = new Date();

		this.logger = Provider.create(finalOptions);

		const Level = this.Level = {
			head: null,
			sequence: [...finalOptions.levels],
			loggers: {},
		};

		for (const level of Level.sequence) {
			Level.loggers[level] = addLevelLogger(this, level);
		}
	}

	get levels() {
		return [...this.Level.sequence];
	}

	hasLevel(level) {
		return this.Level.sequence.includes(level);
	}

	setDefaultLevel(level) {
		assertLevelExisted(this, level);


	}

	isPrevented(level) {
		assertLevelExisted(this, level);

		return this.hasLevel(this, level);
	}

	preventOne(level) {
		assertLevelExisted(this, level);

	}

	preventFrom(level) {
		assertLevelExisted(this, level);
	}
}

export { OptionsSchema };