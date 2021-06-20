module.exports = {
  extends: ['alloy', 'alloy/react'],
  rules: {
    semi: ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'computed-property-spacing': ['error', 'never'],
    'react/no-unstable-nested-components': ['off'],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [2, { max: 1, maxEOF: 0, maxBOF: 0 }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
