import cluster from 'node:cluster';

const ENV_ROLE_KEY = 'DUCK_RUNNER_WORKER_ROLE';
const { isPrimary, isWorker } = cluster;

export function ProcessesModeTemplateProvider(options) {
	return async function execute(BootingKit) {
		/**
		 * @type {import('node:events').EventEmitter}
		 */
		const Bus = BootingKit.Bus;

		if (isPrimary) {
			const pool = new Set();

			const broadcast = (message, ignore = null) => {
				for (const worker of pool) {
					if (worker !== ignore && !worker.isDead()) {
						worker.send(message);
					}
				}
			};

			for (const name in BootingKit.actors) {
				(function forkRole() {
					const worker = cluster.fork({ [ENV_ROLE_KEY]: name });
					const pid = worker.process.pid;

					worker.once('exit', () => {
						pool.delete(worker.process);
						forkRole();
					});

					pool.add(worker.process);

					worker.on('message', message => {
						broadcast(message, worker);
						Bus.emit('message', message, true);
					});
				})();
			}

			Bus.on('message', message => broadcast(message));
		} else if (isWorker) {
			await BootingKit.actors[process.env[ENV_ROLE_KEY]]();
			Bus.on('message', message => process.send(message));
		}

		process.on('message', message => Bus.emit('message', message));
	};
}
