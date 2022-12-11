import * as Commander from './Commander/index.mjs';
import * as Descriptor from './descriptor.mjs';

export class Bridge {}

class ParsingContext {
	constructor(parent, current, feature, state = {}) {
		this.parent = parent;
		this.current = current;
		this.feature = feature;
		this.state = state;
	}

	get proxy() {
		return { ...this };
	}

	create(current, feature) {
		return new ParsingContext(this.current, current, feature, this.state);
	}
}

export const defineBridge = (descriptor) => {
	const finalDescriptor = Descriptor.normalize(descriptor);
	const CLASS_NAME = `${finalDescriptor.name}Bridge`;

	const CustomCommander = Commander.define({
		name: finalDescriptor.name,
		commander: finalDescriptor.commander
	});

	const CustomBridge = { [CLASS_NAME]: class extends Bridge {
		constructor(rootFeature) {
			super();
			this.top = new CustomCommander();
		}

		select(commanderPath) {
			const list = commanderPath.split('.');
			const finding = [''];

			let target = this.top;

			while (list.length > 0) {
				const currentName = list.shift();

				finding.push(currentName);

				if (!target.has(currentName)) {
					throw new Error(`Command "${finding.join(' ')}" is NOT found.`);
				}
			}

			return target;
		}

		async parse() {
			const context = new ParsingContext(null, Commander.TOP, null, {});

			await descriptor.bridge(context.proxy);
			await this.top.build(context);
			await descriptor.parse(context.proxy);
		}
	} }[CLASS_NAME];

	return CustomBridge;
};
