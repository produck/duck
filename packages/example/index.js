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
		DuckLog({
			test: {
				AppenderList: [
					DuckLog.Appender.Console(),
					DuckLog.Appender.File()
				]
			}
		}),
		DuckWeb(),
		DuckWorkspace()
	]
}, function Example({
	injection, Web, Mock, Workspace, Log
}, options) {
	console.log(options);
	Log('test', {});

	DuckLog.Appender.Console();
	DuckLog.Format.ApacheCLF();



	return {
		start() {
			return Mock;
		}
	};
});