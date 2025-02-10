import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		languageOptions: { globals: globals.browser },
		rules: {
			"no-underscore-dangle": "off",
			"no-use-before-define": "off",
			"@typescript-eslint/no-unsafe-function-type ": "off",
			"@typescript-eslint/no-explicit-any": "off",

			// no console.log
			"no-console": "off",
			"no-undef": "warn",
			"no-undefined": "warn",

			// More than 1 blank line not allowed
			"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],

			// e.g: const { a, b } = obj; ✅ | const { a, b, } = obj; ❌
			"comma-dangle": ["error", "never"],

			// e.g: const { key } = obj; ✅ | const { key} = obj; ❌
			"object-curly-spacing": ["error", "always"],

			// e.g: console.log(a + b); ✅ | console.log(a + b) ❌
			semi: ["error", "always"]

			// Max len in one line code
			// "max-len": ["error", { "code": 120, "tabWidth": 2, "ignoreComments": true }]
		}
	},
	pluginJs.configs.recommended
];
