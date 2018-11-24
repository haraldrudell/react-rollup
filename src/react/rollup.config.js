/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import svg from 'rollup-plugin-svg'
import postcss from 'rollup-plugin-postcss'

import path from 'path'

import { readPackageJson, getExternal, formats, mergeRollups, getDirs } from '../letsroll/index.js'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// get path constants
const strings = {main: 'ext', module: 'ext', dependencies: 1, peerDependencies: 1}
const dirs = getDirs()
const {publishPackageJson: filename, publish: baseDir} = dirs
let {main, module, dependencies, peerDependencies} = readPackageJson({filename, strings, baseDir})
const external = getExternal({dependencies, peerDependencies})
const rollupConfigJs = getRollupConfig()

export default [{
  input: dirs.srcLibIndexJs,
  output: {file: main, format: formats.cjs.format},
},{
  input: dirs.srcLibIndexJs,
  output: {file: module, format: formats.esm.format},
}].map(o => mergeRollups(rollupConfigJs, o))

function getRollupConfig() {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvTest = env === 'test'
  const isEnvProduction = env === 'production'
  const isEnvDevelopment = env === 'development'
  const isTypeScriptEnabled = true
  const isFlowEnabled = true
  const areHelpersEnabled = true
  const useESModules = isEnvDevelopment || isEnvProduction
  const useAbsoluteRuntime = true
  const absoluteRuntimePath = useAbsoluteRuntime
    ? path.dirname(require.resolve('@babel/runtime/package.json'))
    : undefined


  return {
    external,
    plugins: [
      eslint({
        include: ['**/*.js', '**/*.mjs', '**/*.jsx'],
        exclude: 'node_modules/**',
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app')],
          settings: { react: { version: '999.999.999' } },
        },
        ignore: false,
        useEslintrc: false,
      }),
      resolve({
        extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'],
        customResolveOptions: {jail: process.cwd()},
      }),
      json(),
      svg(),
      babel({
        babelrc: false,
        configFile: false,
        include: ['**/*.js', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        exclude: 'node_modules/**',
        // presets: [require.resolve('babel-preset-react-app')],
        presets: [
          isEnvTest && [require('@babel/preset-env').default, {targets: {node: 'current',}}],
          (isEnvProduction || isEnvDevelopment) && [
            require('@babel/preset-env').default,
            {targets: {ie: 9},
              ignoreBrowserslistConfig: true,
              useBuiltIns: false,
              modules: false,
              exclude: ['transform-typeof-symbol'],
            }],
          [require('@babel/preset-react').default, {
              development: isEnvDevelopment || isEnvTest,
              useBuiltIns: true,
            }],
          isTypeScriptEnabled && [require('@babel/preset-typescript').default],
        ].filter(Boolean), // end of presets
        plugins: [
          isFlowEnabled && [require('@babel/plugin-transform-flow-strip-types').default,
            false],
          require('babel-plugin-macros'),
          require('@babel/plugin-transform-destructuring').default,
          isTypeScriptEnabled && [require('@babel/plugin-proposal-decorators').default, false],
          [require('@babel/plugin-proposal-class-properties').default,
            {loose: true}],
          [require('@babel/plugin-proposal-object-rest-spread').default, {useBuiltIns: true}],
          [require('@babel/plugin-transform-runtime').default,{
              corejs: false,
              helpers: areHelpersEnabled,
              regenerator: true,
              useESModules,
              absoluteRuntime: absoluteRuntimePath,
            },
          ],
          isEnvProduction && [require('babel-plugin-transform-react-remove-prop-types').default,
            {removeImport: true}],
          require('@babel/plugin-syntax-dynamic-import').default,
          isEnvTest && require('babel-plugin-dynamic-import-node'),
          [require.resolve('babel-plugin-named-asset-import'),
            {loaderMap: {svg: {ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'}}}],
        ].filter(Boolean),
        overrides: [
          isFlowEnabled && {
            exclude: /\.tsx?$/,
            plugins: [require('@babel/plugin-transform-flow-strip-types').default],
          },
          isTypeScriptEnabled && {
            test: /\.tsx?$/,
            plugins: [
              [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
            ],
          },
        ].filter(Boolean),
        runtimeHelpers: true,
        compact: true,
      }),
      commonjs(),
      postcss({
        extensions: ['.sass', '.css', '.scss'],
        preprocessor: async (content, id) => ({ code: sass.renderSync({ file: id }).css.toString() }),
        plugins: [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {flexbox: 'no-2009'},
            stage: 3,
          }),
        ],
        sourceMap: true,
        extract: true,
      }),
    ],
  }
}
