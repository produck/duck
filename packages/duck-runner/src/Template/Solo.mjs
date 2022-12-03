export function SoloModeTemplateProvider(options) {
	return async function execute(BootingKit) {
		await options.beforeExecute(BootingKit);

		try {
			for (const role of BootingKit.roles()) {
				await role.act();
			}

			await options.afterExecute(BootingKit);
		} catch(error) {
			await options.catchExecute(error, BootingKit);
		}
	};
}
