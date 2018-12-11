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

const projectDir = path.resolve()
const tmpDir = path.join(projectDir, 'tmp')
const tmpReact = path.join(tmpDir, 'react')
const tmpReactLib = path.join(tmpReact, 'publish', 'lib')

const srcReact = path.join(path.resolve(), 'src', 'react')

it('Transpile ECMAScript css svg', async () => {

  if (!await fs.pathExists(reactRollup)) throw new Error(`Executable not present: was yarn build run? ${reactRollup}`)

  console.log('Preparing test project directory…')
  await fs.ensureDir(tmpDir)
  await fs.remove(tmpReact)
  await fs.copy(srcReact, tmpReact)

  // build to tmp/react/publish/lib
  console.log(`Building to: ${path.relative(projectDir, tmpReactLib)}`)
  await spawnAsync({
    args: [reactRollup],
    echo: true,
    options: {cwd: tmpReact}
  })
})
