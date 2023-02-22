const BOOT = next => next();
const ACT = (_name, next) => next();

export function SoloModeTemplate(boot = BOOT, act = ACT) {
	return async function execute({ Booting, Kit }) {
		const actors = Booting.actors;

		await boot(async function next() {
			const actions = [];

			for (const name in actors) {
				const action = act(name, async function next() {
					await actors[name]();
				});

				actions.push(action);
			}

			await Promise.all(actions);
		}, Kit);
	};
}
