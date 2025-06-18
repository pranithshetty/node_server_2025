// eslint.config.mjs
import js from '@eslint/js';
import eslintPluginNode from 'eslint-plugin-n';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            node: eslintPluginNode,
        },
        rules: {
            'no-console': 'warn',
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
