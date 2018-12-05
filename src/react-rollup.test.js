/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { spawnAsync } from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

import pjson from '../package.json'
const binFile = Object.values(Object(Object(pjson).bin))[0]
if (!binFile || typeof binFile !== 'string') throw new Error('package.json bin: could ot find executable name')
const reactRollup = path.resolve(binFile)

const tmpDir = path.resolve('tmp')
const tmpReact = path.join(tmpDir, 'react')
const tmpReactPublish = path.join(tmpReact, 'publish')

const srcReact = path.join(path.resolve(), 'src', 'react')


it('Transpile ECMAScript css svg', async () => {
  await fs.ensureDir(tmpDir)
  await fs.remove(tmpReact)
  await fs.copy(srcReact, tmpReact)

  await spawnAsync({
    args: [reactRollup],
    echo: true,
    options: {cwd: tmpReact}
  })
})
