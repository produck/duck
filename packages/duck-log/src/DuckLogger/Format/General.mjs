export function GeneralFormat() {
	return function format(meta, message) {
		if (typeof message !== 'string') {
			throw new TypeError('The `message` MUST be a string.');
		}

		const { time, level, label } = meta;

		return `[${time.toISOString()}] [${level.toUpperCase()}] [${label}]: ${message}`;
	};
};