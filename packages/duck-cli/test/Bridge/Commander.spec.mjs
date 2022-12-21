import assert from 'node:assert/strict';
import * as Bridge from '../../src/Bridge/index.mjs';

describe('DuckCLI::Bridge::Commander', function () {
	describe('constructor()', function () {
		it('should create with default feature.', function () {
			new Bridge.Commander({ name: 'foo' });
		});
	});

	describe('.name', function () {
		it('should get the name of a commander.', function () {
			const commander = new Bridge.Commander({ name: 'foo' });

			assert.equal(commander.name, 'foo');
		});
	});

	describe('.isDefault', function () {
		it('should be true.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child, true);
			assert.equal(child.isDefault, true);
		});

		it('should be false if root.', function () {
			const root = new Bridge.Commander({ name: 'foo' });

			assert.equal(root.isDefault, false);
		});

		it('should be false if not default child.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child);
			assert.equal(child.isDefault, false);
		});
	});

	describe('.options', function () {
		it('should be from a default feature.', function () {
			const commander = new Bridge.Commander({ name: 'foo' });

			assert.deepEqual(commander.options, {
				feature: commander.feature,
				isDefault: commander.isDefault,
			});
		});
	});

	describe('.hasChild()', function () {
		it('should true', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child);
			assert.equal(parent.hasChild('bar'), true);
		});

		it('should false', function () {
			const parent = new Bridge.Commander({ name: 'foo' });

			assert.equal(parent.hasChild('bar'), false);
		});

		it('should throw if a bad name.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });

			assert.throws(() => parent.hasChild(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.',
			});
		});
	});

	describe('.setDefaultChild()', function () {
		it('should set a commander as default', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child);
			assert.equal(child.isDefault, false);
			parent.setDefaultChild('bar');
			assert.equal(child.isDefault, true);
		});

		it('should throw if bad name.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });

			assert.throws(() => parent.setDefaultChild(1), {
				name: 'TypeError',
				message: 'Invalid "name", one "string" expected.',
			});
		});

		it('should throw if non-existed child name.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });

			assert.throws(() => parent.setDefaultChild('bar'), {
				name: 'Error',
				message: 'No child(bar)',
			});
		});
	});

	describe('appendChild()', function () {
		it('should append a child.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });
			const childB = new Bridge.Commander({ name: 'baz', aliases: ['a'] });

			parent.appendChild(child);
			parent.appendChild(childB);
			assert.equal(child.isDefault, false);
			assert.equal(childB.isDefault, false);
		});

		it('should append a child as default.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child, true);
			assert.equal(child.isDefault, true);
		});

		it('should throw if bad commander.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });

			assert.throws(() => parent.appendChild(null), {
				name: 'TypeError',
				message: 'Invalid "commander", one "Commander" expected.',
			});
		});

		it('should throw if bad asDefault.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });

			assert.throws(() => parent.appendChild(child, null), {
				name: 'TypeError',
				message: 'Invalid "asDefault", one "boolean" expected.',
			});
		});

		it('should throw if duplicated by name.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar' });
			const duplicated = new Bridge.Commander({ name: 'bar' });

			parent.appendChild(child);

			assert.throws(() => parent.appendChild(duplicated), {
				name: 'Error',
				message: 'Duplicated child commander(bar).',
			});
		});

		it('should throw if duplicated by alias.', function () {
			const parent = new Bridge.Commander({ name: 'foo' });
			const child = new Bridge.Commander({ name: 'bar', aliases: ['a'] });
			const duplicated = new Bridge.Commander({ name: 'baz', aliases: ['a'] });

			parent.appendChild(child);

			assert.throws(() => parent.appendChild(duplicated), {
				name: 'Error',
				message: 'Duplicated alias(a) in commander(bar)',
			});
		});
	});
});
