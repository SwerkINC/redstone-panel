import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Configuration ESLint pour Backend Node.js + TypeScript + Fastify
 *
 * Améliorations apportées :
 * - Règles TypeScript strictes pour le backend
 * - Règles de sécurité pour les APIs
 * - Règles de performance Node.js
 * - Règles spécifiques à Fastify
 * - Gestion appropriée des promesses et async/await
 * - Configuration spécifique pour les tests et scripts
 */
export default tseslint.config(
    {
        ignores: [
            'dist',
            'node_modules',
            '*.config.js',
            '*.config.ts',
            'coverage',
            'build',
            'prisma/migrations',
            'src/email-templates/node_modules',
            'src/config/client/**/*',
            'src/email-templates/**/*.js',
            'register.js',
            'src/index.d.ts',
        ],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
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

            complexity: ['warn', 30],
            'max-depth': ['warn', 6],
            'max-lines-per-function': [
                'warn',
                {
                    max: 150,
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
    {
        files: ['**/*.test.{ts,js}', '**/*.spec.{ts,js}', '**/test/**/*.{ts,js}'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'max-lines-per-function': 'off',
            complexity: 'off',
            'max-depth': 'off',
            'max-params': 'off',
            'no-console': 'off',
        },
    },
    {
        files: ['*.config.{js,ts}', 'prisma/**/*.{js,ts}', 'scripts/**/*.{js,ts}'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            'no-console': 'off',
            'no-process-exit': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['prisma/**/*.ts'],
        rules: {
            'no-console': 'off',
            'max-lines-per-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['src/types/**/*.ts', 'src/utils/**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'max-params': 'off',
        },
    }
);
