module.exports = {
  env: {
    'react-native/react-native': true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'react-native'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'no-use-before-define': 0,
    'arrow-body-style': 0,
    'react/style-prop-object': 0,
    'object-curly-new-line': 0,
  },
};
