import cluster from 'node:cluster';
import { T } from '@produck/mold';

const ENV_ROLE_KEY = 'DUCK_RUNNER_WORKER_ROLE';
const IPC_MESSAGE_SYMBOL = 'org.produck.runner.processes';
const { isPrimary, isWorker } = cluster;
const MessageData = (args = []) => ({ [IPC_MESSAGE_SYMBOL]: true, args });

export function ProcessesModeTemplateProvider(options) {
	async function asPrimary({ Bus, Booting }) {
		const workers = new Set();

		const _emit = Bus.emit;
		let origin = null;

		Bus.emit = function emit(...args) {
			_emit.apply(this, args);

			const message = MessageData(args);

			for (const worker of workers) {
				if (worker !== origin && !worker.isDead()) {
					worker.send(message);
				}
			}

			origin = null;
		};

		function forkRole(name) {
			const worker = cluster.fork({ [ENV_ROLE_KEY]: name });

			worker.once('exit', () => {
				workers.delete(worker);
				forkRole(name);
			}).on('message', message => {
				if (T.Helper.PlainObjectLike(message) && message[IPC_MESSAGE_SYMBOL]) {
					origin = worker;
					Bus.emit(...message.args);
				}
			});

			workers.add(worker);
		}

		for (const name in Booting.actors) {
			forkRole(name);
		}
	}

	async function asWorker({ Bus, Booting }) {
		await Booting.actors[process.env[ENV_ROLE_KEY]]();
		Bus.on('message', message => process.send(message));

		const _emit = Bus.emit;
		let incoming = false;

		Bus.emit = function emit(...args) {
			_emit.apply(this, args);

			if (!incoming) {
				process.send(MessageData(args));
			}

			incoming = false;
		};

		cluster.worker.on('message', message => {
			if (T.Helper.PlainObjectLike(message) && message[IPC_MESSAGE_SYMBOL]) {
				incoming = true;
				Bus.emit(...message.args);
			}
		});
	}

	return async function execute(BootingKit) {
		if (isPrimary) {
			await asPrimary(BootingKit);
		} else if (isWorker) {
			await asWorker(BootingKit);
		}
	};
}
