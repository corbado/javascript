const esbuild = require('esbuild');
const { define } = require('./esbuild.helper');

esbuild
  .build({
    entryPoints: ['src/index.script.ts'],
    bundle: true,
    minify: true,
    outfile: 'dist/bundle/index.js',
    format: 'esm',
    platform: 'browser',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    tsconfig: 'tsconfig.bundler.json',
    loader: {
      '.svg': 'dataurl',
    },
    alias: {
      '@corbado/shared-ui': '../shared-ui/src',
    },
    define
  })
  .catch(() => process.exit(1));
