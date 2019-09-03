'use strict';

const Duck = require('../../../../index');
const Datahub = require('../index');
const assert = require('assert');

const Account = function Account(adaptor, injection, context) {
	return {
		schemas: {
			type: 'object',
			properties: {
				administrator: { type: 'boolean' },
				id: { type: 'string' },
				name: { type: 'string' },
				email: { type: 'string' },
				avatar: { type: 'string' }
			},
			allowNull: ['email']
		},
		methods: {
			create(payload) {
				return adaptor.create(payload);
			},
			delete(payload) {
				return adaptor.delete(payload);
			},
			update(items) {
				return adaptor.updateAccount(this.id, items);
			},
			query(accountId) {
				return adaptor.getAccountById(accountId);
			}
		}
	};
};

describe('Datahub Component::', function() {
	describe('constructor()', function () {
		it('should be created successfully with correct options.', function () {
			Datahub();
			Datahub([]);
			Datahub([{ id: 'test', models: {} }]);
		});

		it('should throw error with bad options.', function () {
			assert.throws(() => Datahub([null]));
			assert.throws(() => Datahub([{}]));
			assert.throws(() => Datahub([{ id: 2 }]));
		});
	});

	describe('Dependence Datahub::', function () {
		it('should be accessed in `options.installed`.', function (done) {
			Duck({
				id: '',
				components: [
					Datahub()
				],
				installed({ Datahub }) {
					assert(Datahub);
					done();
				}
			});
		});

		it('should be accessed in `callback`.', function (done) {
			Duck({
				id: '',
				components: [
					Datahub()
				]
			}, ({ Datahub }) => {
				assert(Datahub);
				done();
			});
		});

		it('should accessing an existed linker successfully.', function () {
			Duck({
				id: 'com.oc.duck.datahub',
				components: [
					Duck.Datahub([
						{
							id: 'com.oc.duck.test',
							models: { Account }
						}
					])
				],
				installed({ Datahub }) {
					Datahub('com.oc.duck.test');
				}
			});
		});

		it('should throw error if accessing linker not defined.', function () {
			Duck({
				id: 'com.oc.duck.datahub',
				components: [
					Duck.Datahub([
						{
							id: 'com.oc.duck.test',
							models: { Account }
						}
					])
				],
				installed({ Datahub, injection }) {
					assert.throws(() => {
						injection.Model = Datahub('test', {}).model;
					}, {
						message: 'Datahub id=\'test\' is NOT defined.'
					});
				}
			});
		});

		it('should instant a datahub with linker by any adaptor.', function (done) {
			Duck({
				id: 'com.oc.duck.datahub',
				components: [
					Duck.Datahub([
						{
							id: 'com.oc.duck.test',
							models: {
								Account(adaptor, injection, context) {
									assert.equal(adaptor.foo, 'bar');
									assert(injection);
									assert(context);
									done();

									return {
										schemas: {
											type: 'object',
											properties: {
												administrator: { type: 'boolean' },
												id: { type: 'string' },
												name: { type: 'string' },
												email: { type: 'string' },
												avatar: { type: 'string' }
											},
											allowNull: ['email']
										}
									};
								}
							}
						}
					])
				],
				installed({ Datahub }) {
					Datahub('com.oc.duck.test', { foo: 'bar' });
				}
			});
		});
	});
});