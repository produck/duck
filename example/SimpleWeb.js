'use strict';

const http = require('http');
const Duck = require('../');

Duck({
	id: 'com.orchange.duck.demo',
	components: [
		Duck.Web()
	]
}, ({ Web }) => {
	http.createServer(Web.Application.Default()).listen(8080);
});