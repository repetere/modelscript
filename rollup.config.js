import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import async from 'rollup-plugin-async';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.mjs',
    output: {
      exports: 'named',
      file: pkg.browser,
      name: 'modelscript',
      format: 'umd',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }), // so Rollup can find `ms`
      commonjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          // 'node_modules/ml-array-utils/src/index.js': [ 'scale', ],
          // 'node_modules/probability-distributions/index.js': [ 'rbeta', ],
          
        },
      }), // so Rollup can convert `ms` to an ES module
      builtins({
      }),
      globals({
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify 
  // `file` and `format` for each target)
  {
    input: 'src/main.mjs',
    external: [
      'valid-url',
      'csvtojson',
      'http',
      'https',
      'ml',
      'lodash.range',
      'lodash.rangeright',
      'node-fpgrowth',
      'object.values',
      'ml-random-forest',
      'ml-logistic-regression',
      'ml-regression-multivariate-linear',
      'ml-cart',
      'ml-pca',
      'ml-naivebayes',
      'random-js',
      'natural',
      'js-grid-search-lite',
      'probability-distributions',
    ],
    output: [
      {
        exports: 'named',
        file: pkg.commonjs,
        name: 'modelscript',
        format: 'cjs',
      },
      {
        exports: 'named',
        file: pkg.esm,
        name: 'modelscript',
        format: 'es',
      },
    ],
  },
];
