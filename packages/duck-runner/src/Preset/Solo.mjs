export function SoloModeProvider(options) {
	return {
		executor: (Kit, next) => {
			options.log();

			return function player(name, play) {
				play();
			};
		},
		scheduler: (role) => {

		}
	};
}