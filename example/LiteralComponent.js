'use strict';

const Duck = require('../');

Duck({
	id: 'com.orchange.duck.demo',
	components: [
		{
			id: 'com.example.duck.literal',
			name: 'DirectSample',
			install(injection) {
				injection.foo = function () {
					return 'bar';
				}
			},
		}
	]
}, ({ foo }) => {
	console.log(foo());
});