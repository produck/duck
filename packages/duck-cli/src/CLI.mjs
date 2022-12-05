import * as Command from './Command.mjs';

class BaseCLI {
	constructor() {
		this.command = null;
		this.symbol = Symbol('CLI<>');
	}
}

const defineCLI = (descriptor) => {
	const CLASS_NAME = `${descriptor.name}CLI`;
	const CustomCommand = Command.define(descriptor.command);

	const CustomCLI = { [CLASS_NAME]: class extends BaseCLI {
		constructor(options) {
			super();

			descriptor.cli.construct(this.symbol);
			this.command = new CustomCommand(options.command);
		}

		compile() {

		}

		async parse() {
			await descriptor.parse(this.symbol);
		}
	} }[CLASS_NAME];

	return CustomCLI;
};

export {
	defineCLI as define,
	Command
};
