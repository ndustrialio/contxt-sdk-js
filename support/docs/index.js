'use strict';

const glob = require('fast-glob');
const jsdoc2md = require('jsdoc-to-markdown');
const path = require('path');
const buildClass = require('./buildClass');
const buildIndex = require('./buildIndex');
const buildTypedefs = require('./buildTypedefs');

const ROOT_DIR = path.join(__dirname, '..', '..');
const INPUT_FILES = glob.sync(path.join(ROOT_DIR, 'src', '**', '*.js'));
const OUTPUT_DIR = path.join(ROOT_DIR, 'docs');

const data = jsdoc2md.getTemplateDataSync({ files: INPUT_FILES });

buildIndex({ data, outputDir: OUTPUT_DIR });
data
  .filter((item) => item.kind === 'class')
  .forEach((item) =>
    buildClass({ data, name: item.name, outputDir: OUTPUT_DIR })
  );
buildTypedefs({ data, outputDir: OUTPUT_DIR });
