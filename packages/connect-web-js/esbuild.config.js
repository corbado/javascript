const esbuild = require('esbuild');
const { define } = require('./esbuild.helper');

esbuild
  .build({
    entryPoints: ['src/index.script.ts'],
    bundle: true,
    minify: false, // we disable this for now because icons are not yet correctly loading if minified
    outfile: 'dist/bundle/index.js',
    format: 'esm',
    platform: 'browser',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    tsconfig: 'tsconfig.bundler.json',
    loader: {
      '.svg': 'dataurl',
    },
    define,
  })
  .catch(() => process.exit(1));
