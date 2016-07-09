'use strict';

const exec = require('child_process').execSync;
const glob = require('glob').sync;
const fse = require('fs-extra');
const path = require('path');

// We run the Typescript Compiler from the node modules because we want to be consistent
// with the compiler version.
const TSC_BIN = './node_modules/typescript/bin/tsc';
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, 'dist');

// Copy all current source files over to the distribution folder.
// Copy the package.json file to the distribution folder, so we can easily deploy the NPM module.
// Copy the bin directory in order to be able to run the CLI.

fse.copySync(`${PROJECT_ROOT}/lib`, `${OUTPUT_DIRECTORY}/lib`);
fse.copySync(`${PROJECT_ROOT}/package.json`, `${OUTPUT_DIRECTORY}/package.json`);
fse.copySync(`${PROJECT_ROOT}/bin/material-tools`, `${OUTPUT_DIRECTORY}/bin/material-tools`);

// Retrieve all source files.
let sourceFiles = glob(`${PROJECT_ROOT}/lib/**/*.ts`);

// Append our main files to the sourceFiles array.
// TODO(devversion): resolve files through a build configuration for build and release process.
sourceFiles.push(
  `${PROJECT_ROOT}/typings/index.d.ts`,
  `${PROJECT_ROOT}/index.ts`
);

try {
  exec(`node ${TSC_BIN} --declaration ${sourceFiles.join(' ')} --outDir ${OUTPUT_DIRECTORY} --t 'ES5'`, {
    cwd: PROJECT_ROOT
  });

  console.log("Build: Successfully compiled the TypeScript files into ES5.");
} catch (e) {
  console.error("Error: An error occurred while compiling the TypeScript files into ES5.");
  throw e;
}
