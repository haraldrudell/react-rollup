/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { shebang, chmod } from 'rollup-plugin-thatworks'
import json from '../package.json'

import path from 'path'

const {bin, name, dependencies} = Object(json)
const input = String(name || '')
const file = String(Object(bin)[name] || '')
const format = 'cjs'
const external = ['path'].concat(Object.keys(Object(dependencies)))

const dirs = {
  project: path.resolve(),
}
Object.assign(dirs, {
  src: path.join(dirs.project, 'src'),
})
Object.assign(dirs, {
  srcIndexJs: path.join(dirs.src, input),
})

export default {
  input: dirs.srcIndexJs,
  output: {file, format},
  external,
  plugins: [shebang(), chmod()],
}
