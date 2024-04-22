const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../web-core/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const libraryVersion = packageJson.version;

const define = {
  'process.env.FE_LIBRARY_VERSION': JSON.stringify(libraryVersion) 
};

module.exports = { define };