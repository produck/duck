'use strict';

const Duck = require('../');

function Simple() {
	const simple = {};

	Duck({
		id: 'com.orchange.duck.demo',
		name: 'Simple Product',
	}, ({ product }) => {
		
		simple.getMeta = function getMeta() {
			return product.meta;
		};

		simple.getComponents = function getComponents() {
			return product.components;
		}
	});

	return simple;
}

const simple = Simple();

console.log(simple.getMeta());
console.log(simple.getComponents());