/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import presetEnv from '@babel/preset-env'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'
import flowStripTypes from '@babel/plugin-transform-flow-strip-types'
import destructuring from '@babel/plugin-transform-destructuring'
import decorators from '@babel/plugin-proposal-decorators'
import classProperties from '@babel/plugin-proposal-class-properties'
import objectRestSpread from '@babel/plugin-proposal-object-rest-spread'
import transformRuntime from '@babel/plugin-transform-runtime'
import reactRemovePropTypes from 'babel-plugin-transform-react-remove-prop-types'
import syntaxDynamicImport from '@babel/plugin-syntax-dynamic-import'
import dynamicImportNode from 'babel-plugin-dynamic-import-node'
import macros from 'babel-plugin-macros'
import { eslint } from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import svg from 'rollup-plugin-svg'
import postcss from 'rollup-plugin-postcss'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssPresetEnv from 'postcss-preset-env'

import path from 'path'

import { readPackageJson, getExternal, formats, mergeRollups, getDirs } from '../letsroll/index.js'

const formatter = require.resolve('react-dev-utils/eslintFormatter')
const eslintPath = require.resolve('eslint')
const eslintConfigReactApp = require.resolve('eslint-config-react-app')
const namedAssetImport = require.resolve('babel-plugin-named-asset-import')
const runtime = require.resolve('@babel/runtime/package.json')

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
    ? path.dirname(runtime)
    : undefined

  return {
    external,
    plugins: [
      eslint({
        include: ['**/*.js', '**/*.mjs', '**/*.jsx'],
        exclude: 'node_modules/**',
        formatter,
        eslintPath,
        baseConfig: {
          extends: [eslintConfigReactApp],
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
          isEnvTest && [presetEnv, {targets: {node: 'current'}}],
          (isEnvProduction || isEnvDevelopment) && [
            presetEnv,
            {targets: {ie: 9},
              ignoreBrowserslistConfig: true,
              useBuiltIns: false,
              modules: false,
              exclude: ['transform-typeof-symbol'],
            }],
          [presetReact, {
              development: isEnvDevelopment || isEnvTest,
              useBuiltIns: true,
            }],
          isTypeScriptEnabled && [presetTypescript],
        ].filter(Boolean), // end of presets
        plugins: [
          isFlowEnabled && [flowStripTypes, false],
          macros,
          destructuring,
          isTypeScriptEnabled && [decorators, false],
          [classProperties, {loose: true}],
          [objectRestSpread, {useBuiltIns: true}],
          [transformRuntime, {
              corejs: false,
              helpers: areHelpersEnabled,
              regenerator: true,
              useESModules,
              absoluteRuntime: absoluteRuntimePath,
            },
          ],
          isEnvProduction && [reactRemovePropTypes, {removeImport: true}],
          syntaxDynamicImport,
          isEnvTest && dynamicImportNode,
          [namedAssetImport, {loaderMap: {svg: {ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'}}}],
        ].filter(Boolean),
        overrides: [
          isFlowEnabled && {
            exclude: /\.tsx?$/,
            plugins: [flowStripTypes],
          },
          isTypeScriptEnabled && {
            test: /\.tsx?$/,
            plugins: [
              [decorators, { legacy: true }],
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
          postcssFlexbugsFixes,
          postcssPresetEnv({
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
