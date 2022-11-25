import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const meta = require('../package.json');

const versionJSFile = path.resolve('version.mjs');

fs.writeFileSync(versionJSFile, `export default '${meta.version}';`);