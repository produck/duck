import EventEmitter from 'node:events';

class Role {
	constructor(name, play) {
		this.name = name;
		this.play = play.bind();
	}

	async act(BootingKit) {
		const ActingKit = BootingKit(`Acting<${this.name}>`);

		ActingKit.Acting = { name: this.name, at: Date.now() };
		await this.play(undefined, ActingKit);
	}
}

class Mode {
	constructor(name, execute) {
		this.name = name;
		this.execute = execute.bind();
	}

	async boot(RunningKit) {
		const BootingKit = RunningKit(`Booting<${this.name}>`);
		const actors = {};

		for (const role of this.registry.role.values()) {
			actors[role.name] = async () => await role.act(BootingKit);
		}

		Object.freeze(actors);
		BootingKit.Booting = { name: this.name, at: Date.now(), actors };
		await this.execute(undefined, BootingKit);
	}
}

export class RunnerManager {
	constructor(RunnerKit) {
		const ManagerKit = RunnerKit('Manager');
		const registry = { mode: new Map(), role: new Map() };

		this.registry = registry;
		this.ManagerKit = ManagerKit;
	}

	Mode(name, execute) {
		const mode = new Mode(name, execute);

		this.registry.mode.set(name, mode);
	}

	Role(name, play) {
		const role = new Role(name, play);

		this.registry.role.set(name, role);
	}

	async run(modeName) {
		const Bus = new EventEmitter();
		const RunningKit = this.ManagerKit('Running');
		const mode = this.registry.mode.get(modeName);

		RunningKit.Bus = Bus;
		await mode.boot(RunningKit);

		return Bus;
	}
}
