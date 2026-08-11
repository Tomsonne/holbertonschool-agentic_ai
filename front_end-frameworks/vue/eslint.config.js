import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
    {
        ignores: ["dist/**"],
    },
    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "vue/multi-word-component-names": "off",
        },
    },
];