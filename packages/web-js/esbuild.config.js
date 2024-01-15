const esbuild = require('esbuild');

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
  })
  .catch(() => process.exit(1));
