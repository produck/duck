export function install(...list) {
	const queue = [...list];
	const index = () => list.length - queue.length;

	(function _install() {
		if (queue.length === 0) {
			return;
		}

		const current = index();
		let called = false;

		queue.shift()(function next() {
			if (called) {
				throw new Error('next() called multiple times.', { cause: current });
			}

			called = true;
			_install();
		});
	})();

	if (queue.length > 0) {
		throw new Error('Installation aborted.', { cause: index() });
	}
}
