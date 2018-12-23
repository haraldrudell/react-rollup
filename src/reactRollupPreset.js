/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import presetReactEsNext from './babelPresetReactEsNext'
import {eslint} from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import svg from 'rollup-plugin-svg'
import postcss from 'rollup-plugin-postcss'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssPresetEnv from 'postcss-preset-env'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'

import path from 'path'

const formatter = require.resolve('react-dev-utils/eslintFormatter')
const eslintPath = require.resolve('eslint')
const eslintConfigReactApp = require.resolve('eslint-config-react-app')

const getOpt = (v, aDefault) => v != null ? v : aDefault

export default options => {
  !options && (options = {})
  const jail = getOpt(options.jail, process.cwd())
  const assetsPath = options.assetsPath
  if (!assetsPath) throw new Error('reactRollupPreset: options.assetsPath not defined')

  return [
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
      extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx', '.ttf'],
      customResolveOptions: {jail},
    }),
    json(),
    svg(),
    babel({
      babelrc: false,
      configFile: false,
      include: ['**/*.js', '**/*.mjs', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      exclude: 'node_modules/**',
      presets: [[presetReactEsNext, options]],
      runtimeHelpers: true,
      compact: true,
    }),
    commonjs(),
    postcss({
      extensions: ['.sass', '.css', '.scss'],
      preprocessor: async (content, id) => ({ code: sass.renderSync({ file: id }).css.toString() }),
      plugins: [
        postcssImport(), // resolve @import
        postcssUrl({ // copy assets/fonts from their absolute path to publish/lib
          url: 'copy',
          assetsPath,
        }),
        postcssUrl({url: asset => path.basename(asset.absolutePath)}), // drop uri path
        postcssFlexbugsFixes,
        postcssPresetEnv({
          autoprefixer: {flexbox: 'no-2009'},
          stage: 3,
        }),
      ],
      sourceMap: true,
      extract: true,
    }),
  ]
}
