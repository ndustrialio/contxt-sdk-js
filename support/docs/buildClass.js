'use strict';

const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
const path = require('path');

module.exports = function({ data, name, outputDir }) {
  const template = `{{#class name="${name}"~}}{{>docs~}}{{/class~}}`;
  const output = jsdoc2md.renderSync({ data, template });
  const outputPath = path.resolve(outputDir, `${name}.md`);

  fs.writeFileSync(outputPath, output);
};
