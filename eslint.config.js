import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
	pluginJs.configs.recommended,
	{
    ignores: ["coverage/**"],
    ...pluginJest.configs["flat/recommended"],
		languageOptions: { globals: globals.node },
		rules: {
      'jest/prefer-expect-assertions': 'off',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',

			// no console.log
			// "no-console": "off",
			// "no-undef": "warn",
			// "no-undefined": "warn",

			// More than 1 blank line not allowed
			"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],

			// e.g: const { a, b } = obj; ✅ | const { a, b, } = obj; ❌
			"comma-dangle": ["error", "never"],

			// e.g: const { key } = obj; ✅ | const { key} = obj; ❌
			"object-curly-spacing": ["error", "always"],

			// e.g: console.log(a + b); ✅ | console.log(a + b) ❌
			semi: ["error", "always"],

			// Max len in one line code
			"max-len": ["error", { code: 120, tabWidth: 2, ignoreComments: true }]
		}
	}
];
