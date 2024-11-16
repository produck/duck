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

export function Invoker(...chain) {
	const length = chain.length;

	return async function invoker(ctx, next = () => {}) {
		let i = 0;

		return (async function invoke(index) {
			if (i > index) {
				throw new Error('next() called multiple times.');
			}

			if (i <= length) {
				return await (i < length ? chain[i] : next)(ctx, invoke.bind(null, ++i));
			}
		})(i);
	};
}
