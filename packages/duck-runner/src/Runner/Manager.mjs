class Role {
	constructor(name, play) {
		this.name = name;
		this.play = play;
		Object.freeze(this);
	}

	act() {

	}
}

class Mode {
	boot() {

	}

	scheduler(playProxy) {

	}
}

export class RunnerManager {
	constructor() {
		this.executorMap = new Map();
		this.playMap = new Map();
	}

	Mode(name, executor) {
		this.executorMap.set(name, executor);
	}

	Role(name, play) {
		const NAME = `playAsRole${name}`;

		const role = new Role(name, {
			[NAME]: (Kit) => play(Kit(`Running::Role<${name}>`))
		}[NAME]);

		this.Role.set(name, role);
	}
}