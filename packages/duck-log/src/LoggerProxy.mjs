import { createRequire } from 'node:module';
import { Custom, Normalizer, P, S } from '@produck/mold';

const require = createRequire(import.meta.url);
const { LOGGER_TYPE_REGISTRY } = require('./SHARED.cjs');

const DescriptorSchema = Custom(S.Object({
	type: P.String('duck'),
	name: P.String(),
	label: P.String(),
	format: P.Function(Format.General),
	levels: S.Array({
		items: P.String(),
		minLength: 1,
		key: symbol => symbol
	}),
	defaultLevel: P.String(),
	preventLevels: S.Array({
		items: P.String()
	})
}), (_value, _empty, next) => {
	const value = next();
});

const MUTE = () => {};

class DuckCategoryLoggerProxy {
	constructor() {
		this.label = '';
		this.levelLoggerList = [];
		this.preventLevels = {};
		this.sharedDate = new Date();

		this._log = () => {};
	}

	isPrevented(level) {
		return false;
	}

	LevelLogger(level) {
		if (this.levelLoggerList.some(logger => logger.level === level)) {
			throw new Error();
		}

		const levelLogger = {
			level,
			log: message => {
				this.sharedDate.setTime(Date.now());
				this._log(this.label, level, this.sharedDate, message)
			}
		}

		this.levelLoggerList.push(levelLogger);

		return levelLogger;
	}
}

export { DescriptorSchema };