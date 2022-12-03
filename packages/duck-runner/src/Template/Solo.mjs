export function SoloModeTemplateProvider(options) {
	return async function execute(BootingKit) {
		await options.beforeExecute(BootingKit);

		try {
			for (const name in BootingKit.actors) {
				await BootingKit.actors[name]();
			}

			await options.afterExecute(BootingKit);
		} catch(error) {
			await options.catchExecute(error, BootingKit);
		}
	};
}
