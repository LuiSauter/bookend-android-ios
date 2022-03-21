module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'linebreak-style': 0,
    semi: ['error', 'never'],
    'react-native/no-inline-styles': 0,
    'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    // 'simple-import-sort/imports': 'error',
    // 'simple-import-sort/exports': 'error',
  },
}
