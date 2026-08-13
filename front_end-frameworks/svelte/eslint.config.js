import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist", "node_modules"]),
    js.configs.recommended,
    ...svelte.configs.recommended,
    {
        files: ["**/*.{js,svelte}"],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
]);
