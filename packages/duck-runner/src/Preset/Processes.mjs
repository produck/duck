import cluster from 'node:cluster';

const { isPrimary } = cluster;

function forkRole(role) {

}

export function ProcessesModeProvider(options) {
	return function ProcessesModeExecutor(Kit) {
		return function executor() {
			options.log();

			return function player(name, role) {
				role.play();
			};
		};
	};
}