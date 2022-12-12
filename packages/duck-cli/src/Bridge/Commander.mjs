import * as Feature from './Feature.mjs';

export class Commander {
	constructor(feature) {
		this.symbol = Symbol('Commander');
		this.feature = Feature.normalize(feature);
		this.children = {};
	}

	has(childName) {
		return Object.hasOwn(this.children, childName);
	}

	appendChild(commander) {
		if (this.has(commander.feature.name)) {
			throw new Error('Duplicated child commander name.');
		}

		this.children[commander.feature.name] = commander;
	}

	select(path) {
		const list = path.split(' ');
		const finding = [this.feature.name];

		let target = this;

		while (list.length > 0) {
			const currentName = list.shift();

			finding.push(currentName);

			if (!target.has(currentName)) {
				throw new Error(`Command "${finding.join(' ')}" is NOT found.`);
			}
		}

		return target;
	}

	async buildChildren(context) {
		for (const name in this.children) {
			await this.children[name].build(context);
		}
	}
}
