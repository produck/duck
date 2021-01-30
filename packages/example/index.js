const Duck = require('@produck/duck');
const DuckWeb = require('@produck/duck-web');
const DuckLog = require('@produck/duck-log');
const DuckWorkspace = require('@produck/duck-workspace');
const meta = require('./package.json');

module.exports = Duck({
	id: 'org.produck.example',
	version: meta.version,
	name: meta.name,
	description: meta.description,
	components: [
		DuckLog(),
		DuckWeb(),
		DuckWorkspace()
	]
}, function Example({
	injection, Web, Mock, Workspace
}, options) {
	console.log(options);

	return {
		start() {
			return Mock;
		}
	};
});