'use strict';

module.exports = function callback(app, _context, { product }) {
	app.use(ctx => {
		ctx.body = 'hello, world!\n\nProduct Meta\n\n';
		ctx.body += JSON.stringify(product.meta, null, '  ');
		ctx.body += '\n\nProduct Components\n\n';
		ctx.body += JSON.stringify(product.components, null, '  ');
		ctx.body += '\n\n--Duck Quack~';
	});
};