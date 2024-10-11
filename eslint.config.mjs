import globals from "globals";
import babelParser from "babel-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("@ndustrial", "prettier"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.mocha,
            ...globals.node,
            expect: true,
            faker: true,
            fixture: true,
            sinon: true,
        },

        parser: babelParser,
        ecmaVersion: 6,
        sourceType: "module",
    },

    rules: {
        "no-unused-expressions": "off",
    },
}];