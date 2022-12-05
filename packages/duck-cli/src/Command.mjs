import { Circ, Normalizer, P, PROPERTY, S } from '@produck/mold';

const CommandDescriptorSchema = S.Object({
	name: P.String(),
	description: P.String(''),
	alias: S.Array({ items: P.String(), key: _ => _ }),
	options: S.Object({
		[PROPERTY]: S.Object({
			name: P.String(),
			alias: P.String(),
			description: P.OrNull(P.String()),
			value: P.OrNull(P.String(), false)
		})
	}),
	arguments: S.Array({
		items: S.Object({
			name: P.String(),
			required: P.Boolean(false),
			variadic: P.Boolean(false),
		}),
		key: _ => _.name
	}),
	handler: P.Function(() => {}),
});

const normalize = Normalizer(CommandDescriptorSchema);

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

const defineCommand = (descriptor) => {
	const CLASS_NAME = `${descriptor.name}Command`;

	const CustomCommand = { [CLASS_NAME]: class extends BaseCommand {
		constructor(options, parent = null) {
			const finalOptions = normalize(options);

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

export {
	BaseCommand as Base,
	defineCommand as define,
	CommandDescriptorSchema as Schema,
};
