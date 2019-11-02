module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "extends": ["eslint:recommended", "airbnb", "plugin:prettier/recommended", "prettier/react"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018
    },
    "plugins": [
        "react",
        "babel",
        "react-hooks"
    ],
    "rules": {
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
      'react/jsx-wrap-multilines': 2,
      'react/jsx-props-no-spreading': 0,
      'react/prop-types': 'warn',
      'semi': ['error', 'never'],
      'react/prop-types': 'off',
      'react/jsx-filename-extension': 'off',
      'react/require-default-props': 'off',
    }
}