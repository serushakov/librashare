module.exports = {
  env: {
    'react-native/react-native': true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'airbnb',
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
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
  },
};
