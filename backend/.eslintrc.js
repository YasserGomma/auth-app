module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off', 
    'no-underscore-dangle': 'off',        
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', 
    'max-classes-per-file': 'off',
    'lines-between-class-members': 'off',
    'import/order': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.spec.ts', '**/*.test.ts'],
      },
    ],
  },
};
