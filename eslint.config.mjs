import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as ProduckEslint from '@produck/eslint-rules';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ['**/*.{js,mjs,ts}']},
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	ProduckEslint.config,
	ProduckEslint.excludeGitIgnore(import.meta.url),
];
