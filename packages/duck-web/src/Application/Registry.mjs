import { T } from '@produck/mold';

import * as Options from './Options.mjs';

export class ApplicationRegistry {
	constructor(DuckWebKit) {
		this.Kit = DuckWebKit('DuckWeb::Registry');
		this.map = new Map();
	}

	register(options) {
		const { id, Provider, description } = Options.normalize(options);
		const ApplicationKit = this.Kit(`DuckWeb::Application::<${id}>`);

		ApplicationKit.WebAppMeta = Object.freeze({ id, description });

		const Application = Provider(ApplicationKit);

		if (!T.Native.Function(Application)) {
			throw new Error('`Provider` MUST return a function as `Application`.');
		}

		if (this.map.has(id)) {
			throw new Error(`Duplicate Application id=${id}.`);
		}

		this.map.set(id, {
			id, description,
			ApplicationProxy: (...args) => {
				const application = Application(...args);

				if (!T.Native.Function(application)) {
					throw new Error('Bad application, one "(req, res) => void" expected.');
				}

				return application;
			}
		});
	}

	get(id) {
		if (!T.Native.String(id)) {
			throw new TypeError('Invalid "id", one "string" expected.');
		}

		if (!this.map.has(id)) {
			throw new Error(`No application id="${id}" existed.`);
		}

		return this.map.get(id);
	}
}