/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a rollup preset at lib/
*/
import presetEsNext from '../rollupPresetEsNext'
import json from '../../package.json'

import path from 'path'

const {module, dependencies} = Object(json)
if (!module || typeof module !== 'string') throw new Error('package.json module not non-empty string')
const file = path.extname(module) ? module : module + '.js'
const format = 'esm'
const external = ['path'].concat(Object.keys(Object(dependencies)))

const dirs = {
  project: path.resolve(),
}
Object.assign(dirs, {
  src: path.join(dirs.project, 'src'),
})
Object.assign(dirs, {
  srcPresetJs: path.join(dirs.src, 'reactRollupPreset'),
})

export default {
  input: dirs.srcPresetJs,
  output: {file, format},
  external,
  plugins: presetEsNext(),
}
