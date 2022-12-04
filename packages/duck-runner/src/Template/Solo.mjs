export function SoloModeTemplateProvider(options) {
	return async function execute({ Kit: BootingKit, Booting }) {
		await options.beforeExecute(BootingKit);

		try {
			for (const name in Booting.actors) {
				await Booting.actors[name]();
			}

			await options.afterExecute(BootingKit);
		} catch(error) {
			await options.catchExecute(error, BootingKit);
		}
	};
}
