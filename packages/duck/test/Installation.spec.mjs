import * as assert from 'node:assert/strict';
import { describe, it } from 'mocha';

import * as Installation from '../src/Installation.mjs';

describe('Installation', function () {
	it('should install.', function () {
		let a = false, b = false, c = false;

		Installation.install(
			next => {
				a = true;
				next();
			},
			next => {
				b = true;
				next();
			},
			next => {
				c = true;
				next();
			},
		);

		assert.ok(a);
		assert.ok(b);
	});
});
