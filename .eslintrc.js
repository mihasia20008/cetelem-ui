module.exports = {
  extends: ['react-app', 'airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  rules: {
    "react/static-property-placement": ['error', 'static public field'],
    'react/jsx-props-no-spreading': 0,
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/prop-types': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'import/imports-first': ['error', 'absolute-first'],
    'import/newline-after-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: './',
      },
    ],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    __DEV__: true,
    __PROD__: true,
  },
  parser: 'babel-eslint',
};
