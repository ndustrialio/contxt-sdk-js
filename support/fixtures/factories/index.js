'use strict';

const fs = require('fs');
const path = require('path');
const factory = require('rosie').Factory;

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (filename) =>
      filename.indexOf('.') !== 0 &&
      filename !== basename &&
      filename.slice(-3) === '.js'
  )
  .forEach((filename) => require(`./${filename}`));

module.exports = factory;
