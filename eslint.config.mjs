import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { includeIgnoreFile } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, ".gitignore");
export default [
    includeIgnoreFile(gitignorePath),
    {
        ignores: ["eslint.config.mjs", "support/", "gulpfile.js"]
    },
    ...compat.extends("prettier"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.mocha,
            ...globals.node,
            globals: true,
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