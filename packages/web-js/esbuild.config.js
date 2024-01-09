const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.script.ts'],
    bundle: true,
    minify: true,
    outfile: 'bundle/index.js',
    format: 'esm',
    platform: 'browser',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    tsconfig: 'tsconfig.bundler.json',
  })
  .catch(() => process.exit(1));
