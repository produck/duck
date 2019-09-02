'use strict';

const Duck = require('../');

Duck({
	id: 'com.xxx.yy.zz',
}, ({ product }) => {
	console.log(product.meta);
	console.log(product.components);
	console.log(product.duck);
});