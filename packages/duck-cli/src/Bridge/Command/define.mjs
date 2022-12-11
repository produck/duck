import * as Options from './Options.mjs';

class BaseCommand {
	constructor(descriptor) {
		this.name = descriptor.name;
		this.description = descriptor.description;
		this.args = [];
		this.opts = {};
		this.alias = {};

		this.children = {};
		this.symbol = Symbol(`CLI::Command<${descriptor.name}>`);
	}

	get descriptor() {
		return {

		};
	}
}

export const defineCommand = (descriptor) => {
	const CLASS_NAME = `${descriptor.name}Command`;

	const CustomCommand = { [CLASS_NAME]: class extends BaseCommand {
		constructor(options, parent = null) {
			const finalOptions = Options.normalize(options);

			super(finalOptions);

			descriptor.construct(this.symbol, {
				parent: parent === null ? null : parent.symbol,
				name: finalOptions.name,
				alias: finalOptions.alias,
				opts: finalOptions.options,
				handler: finalOptions.handler
			});

			for (const name in finalOptions.children) {
				const child = new CustomCommand(finalOptions.children[name], this.symbol);

				this.children[name] = child;
			}
		}

		build() {
			descriptor.command(this.descriptor);
		}
	} }[CLASS_NAME];

	return CustomCommand;
};
