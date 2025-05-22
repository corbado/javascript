const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    outfile: 'dist/bundle/index.js',
    format: 'esm',
    platform: 'browser',
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })
  .catch(() => process.exit(1));
