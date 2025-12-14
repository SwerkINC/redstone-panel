import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwindcss from 'eslint-plugin-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat();

export default defineConfig([
    globalIgnores(['dist']),

    ...compat.extends('plugin:tailwindcss/recommended'),
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            tailwindcss,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/enforces-shorthand': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/no-require-imports': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-template': 'error',
            'no-useless-concat': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',
            'no-throw-literal': 'error',
            'no-console': 'off',
            'no-process-exit': 'warn',
            'no-async-promise-executor': 'error',
            'no-await-in-loop': 'warn',
            'no-promise-executor-return': 'error',
            'prefer-promise-reject-errors': 'error',
            'no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
            'no-return-assign': 'warn',
            'no-sequences': 'warn',
            'no-duplicate-imports': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['**/dist/**'],
                            message:
                                'Import depuis le dossier dist interdit. Utilisez les chemins source à la place.',
                        },
                    ],
                },
            ],

            complexity: ['warn', 40],
            'max-depth': ['warn', 6],
            'max-lines-per-function': [
                'warn',
                {
                    max: 250,
                    skipBlankLines: true,
                    skipComments: true,
                },
            ],
            'max-params': ['warn', 6],
            'no-ex-assign': 'error',
            'no-inner-declarations': 'error',
            'no-irregular-whitespace': 'error',
            'consistent-return': 'off',
        },
    },

    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
]);
