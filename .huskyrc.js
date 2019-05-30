const tasks = (arr) => arr.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks([
      'pretty-quick --staged',
      'npm run build:docs',
      'npm run add:docs'
    ])
  }
};
