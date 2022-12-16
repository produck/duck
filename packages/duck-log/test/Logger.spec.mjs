import assert from 'node:assert/strict';
import * as Logger from '../src/Logger/index.mjs';

describe('DuckLog::Logger', function () {
	describe('::Options::normalize()', function () {
		it('should pass a default options.', function () {
			const finalOptions = Logger.Options.normalize({ label: 'foo' });

			assert.deepEqual(finalOptions, {
				label: 'foo',
				level: {
					head: 'info',
					sequence: [...Logger.Options.DEFAULT_LEVELS],
					prevents: [],
				},
				Transcriber: finalOptions.Transcriber,
			});
		});

		it('should throw if bad label.', function () {
			assert.throws(() => {
				Logger.Options.normalize({});
			}, {
				name: 'TypeError',
				message: 'Invalid ".label", one required "string" expected.',
			});
		});

		it('should throw if bad level sequence length.', function () {
			assert.throws(() => {
				Logger.Options.normalize({ label: 'foo', level: { sequence: [] } });
			}, { name: 'TypeError' });
		});

		it('should throw if bad level head.', function () {
			assert.throws(() => {
				Logger.Options.normalize({ label: 'b', level: { sequence: ['a'] } });
			}, {
				name: 'TypeError',
				message: 'Invalid ".level", one "unknown" expected.\n' +
					'Error: Level head MUST be one member of levels list.',
			});
		});

		it('should throw if bad level prevents.', function () {
			assert.throws(() => {
				Logger.Options.normalize({
					label: 'a',
					level: { head: 'a', sequence: ['a'], prevents: ['b'] },
				});
			}, {
				name: 'TypeError',
				message: 'Invalid ".level", one "unknown" expected.\n' +
					'Error: The level(b) at [0] is NOT a member.',
			});
		});
	});

	describe('::LoggerHandler', function () {
		describe('.constructor()', function () {
			it('should create with default options items.', function () {
				new Logger.Handler({ label: 'foo' });
			});

			it('throw if bad Transcriber.', function () {
				assert.throws(() => {
					new Logger.Handler({ label: 'foo', Transcriber: () => {} });
				}, {
					name: 'TypeError',
					message: 'Invalid ".Transcriber", one "() => Function" expected.',
				});
			});
		});

		describe('.levels', function () {
			it('should get all registered level names.', function () {
				const handler = new Logger.Handler({ label: 'foo' });

				assert.deepEqual(handler.levels, Logger.Options.DEFAULT_LEVELS);
			});
		});

		describe('.hasLevel()', function () {
			it('should get true.', function () {
				assert.equal(new Logger.Handler({ label: 'a' }).hasLevel('info'), true);
			});

			it('should get false.', function () {
				assert.equal(new Logger.Handler({ label: 'a' }).hasLevel('a'), false);
			});
		});

		describe('.assertLevel()', function () {
			it('should throw if bad level.', function () {
				assert.throws(() => {
					new Logger.Handler({ label: 'a' }).assertLevel(1);
				}, {
					name: 'TypeError',
					message: 'Invalid "level", one "string" expected.',
				});
			});

			it('should throw if non-existed level.', function () {
				assert.throws(() => {
					new Logger.Handler({ label: 'a' }).assertLevel('a');
				}, {
					name: 'Error',
					message: 'Can NOT access a non-existed level(a).',
				});
			});
		});

		describe('.isPrevent()', function () {
			it('should get true.', function () {
				const handler = new Logger.Handler({
					label: 'a',
					level: { prevents: ['info'] },
				});

				assert.equal(handler.isPrevent('info'), true);
			});

			it('should get false.', function () {
				const handler = new Logger.Handler({
					label: 'a',
				});

				assert.equal(handler.isPrevent('info'), false);
			});
		});

		describe('.resume()', function () {
			it('should resume a recorder from IGNORE.', function () {
				const handler = new Logger.Handler({
					label: 'a',
					level: { prevents: ['info'] },
				});

				assert.equal(handler.isPrevent('info'), true);
				handler.resume('info');
				assert.equal(handler.isPrevent('info'), false);
			});
		});

		describe('.prevent()', function () {
			it('should prevent a recorder from a formal.', function () {
				const handler = new Logger.Handler({ label: 'a' });

				assert.equal(handler.isPrevent('info'), false);
				handler.prevent('info');
				assert.equal(handler.isPrevent('info'), true);
			});
		});

		describe('.preventTo()', function () {
			it('should resume all recorders.', function () {
				const handler = new Logger.Handler({
					label: 'a',
					level: { prevents: ['info'] },
				});

				assert.equal(handler.isPrevent('info'), true);
				handler.preventTo('trace');

				for (const level of Logger.Options.DEFAULT_LEVELS) {
					assert.equal(handler.isPrevent(level), false);
				}
			});

			it('should prevent recorders to "warn" before.', function () {
				const handler = new Logger.Handler({ label: 'a' });

				handler.preventTo('warn');

				for (const level of Logger.Options.DEFAULT_LEVELS.slice(0, 3)) {
					assert.equal(handler.isPrevent(level), true);
				}

				for (const level of Logger.Options.DEFAULT_LEVELS.slice(3)) {
					assert.equal(handler.isPrevent(level), false);
				}
			});
		});

		describe('.setHead()', function () {
			it('should set a valid level to head.', function () {
				const handler = new Logger.Handler({ label: 'a' });

				handler.setHead('error');
				assert.equal(handler.head, 'error');
			});
		});
	});

	describe('::LoggerProxy()', function () {
		it('should access level.', function () {
			const handler = new Logger.Handler({ label: 'a' });
			const proxy = handler.proxy;

			proxy({});
			proxy.info({});
		});

		it('should throw if non-existed level.', function () {
			const handler = new Logger.Handler({ label: 'a' });
			const proxy = handler.proxy;

			assert.throws(() => proxy.foo, {
				name: 'Error',
				message: 'Missing level(foo).',
			});
		});

		it('should access its handler by MODIFIER.', function () {
			const handler = new Logger.Handler({ label: 'a' });
			const proxy = handler.proxy;

			assert.equal(proxy[Logger.MODIFIER], handler);
		});

		it('should call IGNORE.', function () {
			const handler = new Logger.Handler({
				label: 'a',
				level: { prevents: ['info'] },
			});

			handler.proxy.info({});
		});
	});
});
