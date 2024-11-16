import globals from 'globals';
import pluginJs from '@eslint/js';
// import tseslint from "typescript-eslint";
import ProduckRules from '@produck/eslint-rules';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ['**/*.{js,mjs,cjs,ts}']},
	{languageOptions: { globals: {...globals.browser, ...globals.node} }},
	pluginJs.configs.recommended,
	// ...tseslint.configs.recommended,
	ProduckRules,
];
