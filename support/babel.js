const babelRegister = require('babel-register');

babelRegister({
  babelrc: false,
  plugins: ['../node_modules/babel-plugin-istanbul'],
  presets: ['env']
});
