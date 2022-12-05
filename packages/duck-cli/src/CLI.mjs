class BaseCLI {

}

const defineCLI = (options) => {
	const CLASS_NAME = `${options.name}CLI`;

	const CustomCLI = {
		[CLASS_NAME]: class extends BaseCLI {

		}
	}[CLASS_NAME];

	return CustomCLI;
};
