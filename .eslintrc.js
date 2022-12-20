module.exports = {
    parser: '@typescript-eslint/parser',
    overrides: [{
        files: ['*.ts', '*.tsx'],

        extends: [
            'plugin:@typescript-eslint/recommended', //  Use the recommended rules from the @typescript-eslint/eslint-plugin
        ],
        parserOptions: {
            project: [__dirname + '/tsconfig.json', __dirname + '/tsconfig.test.json']
        },
        rules: {
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/ban-types': 'off'
        }
    }, {
        files: ['*.mjs', '*.js', '*.jsx', '*.es']
    }],
    plugins: [
        '@typescript-eslint',
        'prettier'
    ],
    
    rules: {
        'prettier/prettier': 'error',
        'no-var-require': 'off',
        'no-console': 'off',
        'no-bitwise': 'off',
        quotes: ['error', 'single'],
        'max-len': ['error', 120],
        'arrow-parens': 'off'
    }
};
