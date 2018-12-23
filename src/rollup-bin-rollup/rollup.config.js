/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import reactRollupPreset from '../reactRollupPreset'
import { readPackageJson, getExternal, formats, getDirs } from '../letsroll/index.js'
import path from 'path'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
const presetOptions = {env: {targets: {node: '8.5'}}}

// get path constants
const strings = {main: 'ext', module: 'ext', dependencies: 1, peerDependencies: 1}
const dirs = getDirs()
const {publishPackageJson: filename, publish: baseDir} = dirs
let {main, module, dependencies, peerDependencies} = readPackageJson({filename, strings, baseDir})
const external = getExternal({dependencies, peerDependencies})

export default [{
  input: dirs.srcLibIndexJs,
  output: {file: main, format: formats.cjs.format},
},{
  input: dirs.srcLibIndexJs,
  output: {file: module, format: formats.esm.format},
}].map(o => ({...o, external, plugins: [...reactRollupPreset({...presetOptions,
  assetsPath: path.dirname(o.output.file),
})]}))
