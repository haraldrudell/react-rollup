/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

trannslation of https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app
version: 6.1.0 181223
*/
import presetEsNext from 'babel-preset-7-esnext'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'
import flowStripTypes from '@babel/plugin-transform-flow-strip-types'
import transformRuntime from '@babel/plugin-transform-runtime'
import reactRemovePropTypes from 'babel-plugin-transform-react-remove-prop-types'
import dynamicImportNode from 'babel-plugin-dynamic-import-node'
import macros from 'babel-plugin-macros'
import path from 'path'

const namedAssetImport = require.resolve('babel-plugin-named-asset-import')
const runtime = require.resolve('@babel/runtime/package.json')

const getOpt = (value, aDefault) => value != null ? value : aDefault

export default (api, options, dirname) => {
  !options && (options = {})
  const env = getOpt(options.env, process.env.BABEL_ENV || process.env.NODE_ENV)
  const isEnvTest = env === 'test'
  const isEnvProduction = env === 'production'
  const isEnvDevelopment = env === 'development'
  const isTypeScriptEnabled = getOpt(options.typescript, true)
  const isFlowEnabled = getOpt(options.flow, true)
  const areHelpersEnabled = getOpt(options.helpers, true)
  const useESModules = getOpt(options.useESModules, isEnvDevelopment || isEnvProduction)
  const useAbsoluteRuntime = getOpt(options.absoluteRuntime, true)
  const absoluteRuntimePath = useAbsoluteRuntime
    ? path.dirname(runtime)
    : undefined
  const esNextOptions = isEnvTest
    ? {}
    : {targets: {ie: 9},
      ignoreBrowserslistConfig: true,
      useBuiltIns: false,
      modules: false,
      exclude: ['transform-typeof-symbol'],
    }
  isTypeScriptEnabled && (esNextOptions.decorators = {legacy: true})
  return {presets: [
    [presetEsNext, esNextOptions],
    [presetReact, {
        development: isEnvDevelopment || isEnvTest,
        useBuiltIns: true,
    }],
    isTypeScriptEnabled && [presetTypescript],
  ].filter(Boolean), // end of presets
  plugins: [
    isFlowEnabled && [flowStripTypes, false],
    macros,
    [transformRuntime, {
      corejs: false,
      helpers: areHelpersEnabled,
      regenerator: true,
      useESModules,
      absoluteRuntime: absoluteRuntimePath,
    }],
    isEnvProduction && [reactRemovePropTypes, {removeImport: true}],
    isEnvTest && dynamicImportNode,
    [namedAssetImport, {loaderMap: {svg: {ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'}}}],
  ].filter(Boolean),
  overrides: [
    isFlowEnabled && {
      exclude: /\.tsx?$/,
      plugins: [flowStripTypes],
    },
  ].filter(Boolean)}
}
