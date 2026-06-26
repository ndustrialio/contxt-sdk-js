'use strict';

// auth0-js 9.32.0 added "type": "module" to its package.json but its main
// entry is still a UMD bundle with no ESM exports. Node refuses to require()
// it on < 22.12. We manually compile the UMD source as CJS via
// Module._compile, which bypasses the ESM type check, and cache the result.
const fs = require('fs');
const path = require('path');
const Module = require('module');

const auth0Path = require.resolve('auth0-js');
const auth0Source = fs.readFileSync(auth0Path, 'utf8');

const auth0Module = new Module(auth0Path, module);
auth0Module.filename = auth0Path;
auth0Module.paths = Module._nodeModulePaths(path.dirname(auth0Path));
auth0Module._compile(auth0Source, auth0Path);

require.cache[auth0Path] = auth0Module;
