import { T, Utils } from '@produck/mold';
import * as Handler from './Handler.mjs';

export class DuckLoggerRegistry {
	constructor() {
		this.map = new Map();
	}

	register(category, options) {
		if (!T.Native.String(category)) {
			Utils.throwError('category', 'string');
		}

		if (this.map.has(category)) {
			throw new Error(`The category(${category}) is existed.`);
		}

		const handler = new Handler.LoggerHandler(options);

		this.map.set(category, handler);

		return handler;
	}

	get(category) {
		return this.map.get(category);
	}
}
