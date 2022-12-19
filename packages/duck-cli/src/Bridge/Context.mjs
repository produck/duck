import * as Feature from './Feature.mjs';

export class Context {
	constructor(parent, current, feature) {
		this.parent = parent;
		this.current = current;
		this.feature = Feature.normalize(feature);
	}

	get proxy() {
		return Object.freeze({ ...this });
	}

	create(current, feature) {
		return new Context(this.current, current, feature);
	}
}
