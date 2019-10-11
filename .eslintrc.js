module.exports = {
  plugins: ['babel', 'react-hooks'],
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'es5',
        semi: false,
      },
    ],
    'arrow-parens': [1, 'as-needed'],
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    'no-unused-expressions': ['warn', { allowShortCircuit: true }],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-warning-comments': 1,
    'prefer-destructuring': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',

    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.stories.js', '**/*.test.js', '**/demo/**'] },
    ],

    'jsx-a11y/label-has-for': 0, // this is deprecated in future versions so disable now
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either', // fs-styles does not support nesting currently
      },
    ],
    'react/jsx-filename-extension': 'never',
    'react/jsx-wrap-multilines': 'always',
    'react/prop-types': 'warn',
    'semi': ['error', 'never'],
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/require-default-props': 'off',
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',
  }
};