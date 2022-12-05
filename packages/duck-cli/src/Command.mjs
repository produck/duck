class BaseCommand {

}

const defineCommand = (options) => {
	const CLASS_NAME = `${options.name}Command`;

	const CustomCommand = {
		[CLASS_NAME]: class extends BaseCommand {

		}
	}[CLASS_NAME];

	return CustomCommand;
};
