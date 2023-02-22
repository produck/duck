import cluster from 'node:cluster';
import { T } from '@produck/mold';

const ENV_ROLE_KEY = 'DUCK_RUNNER_WORKER_ROLE';
const IPC_MESSAGE_SYMBOL = 'org.produck.runner.processes';
const { isPrimary, isWorker } = cluster;
const MessageData = (args = []) => ({ [IPC_MESSAGE_SYMBOL]: true, args });

const BOOT = next => next();
const ACT = (_name, next) => next();

export function ProcessesModeTemplate(boot = BOOT, act = ACT) {
	async function asPrimary({ Kit, Bus, Booting }) {
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

		boot(async function next() {
			const actions = [];

			for (const name in Booting.actors) {
				const action = act(name, async function next() {
					forkRole(name);
				});

				actions.push(action);
			}

			await Promise.all(actions);
		}, Kit);
	}

	async function asWorker({ Bus, Booting }) {
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

		await Booting.actors[process.env[ENV_ROLE_KEY]]();
	}

	return async function execute(BootingKit) {
		if (isPrimary) {
			await asPrimary(BootingKit);
		} else if (isWorker) {
			await asWorker(BootingKit);
		}
	};
}
