const esbuild = require('esbuild');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../web-core/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const libraryVersion = packageJson.version;

async function processCSS() {
  const cssFilePath = '../connect-react/src/index.css';
  const cssContent = fs.readFileSync(cssFilePath, 'utf8');

  const result = await postcss([postcssImport()]).process(cssContent, {
    from: cssFilePath,
  });

  return result.css; // Return the inlined CSS
}

processCSS().then(cssFileContent => {
  esbuild
    .build({
      entryPoints: ['src/index.script.ts'],
      bundle: true,
      minify: false, // we disable this for now because icons are not yet correctly loading if minified
      outfile: 'dist/bundle/index.js',
      format: 'esm',
      platform: 'browser',
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
      tsconfig: 'tsconfig.bundler.json',
      loader: {
        '.svg': 'dataurl',
      },
      // plugins: [inlineCssPlugin()],
      logLevel: 'debug',
      define: {
        'process.env.FE_LIBRARY_VERSION': JSON.stringify(libraryVersion),
        'process.env.CBO_STYLES': JSON.stringify(cssFileContent),
      },
    })
    .catch(() => process.exit(1));
});
