'use strict';

const Duck = require('../index');

const Account = function Account(store, injection, context) {
	console.log(injection);

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
				return injection.account.create(payload);
			},
			delete(payload) {
				return injection.account.delete(payload);
			},
			update(items) {
				return injection.store.updateAccount(this.id, items);
			},
			query(accountId) {
				return injection.store.getAccountById(accountId);
			}
		}
	};
};

Duck({
	id: 'com.oc.duck.datahub',
	components: [
		Duck.Datahub([
			{
				id: 'com.oc.duck.test',
				models: {
					Account
				}
			}
		])
	],
	installed({ Datahub, injection }) {
		injection.Model = Datahub('com.oc.duck.test', {}).model;
	}
}, ({ Datahub, Model }) => {
	console.log(Model.Account)
});