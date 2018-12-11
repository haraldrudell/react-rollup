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
const renderDir = path.join(tmpDir, 'render')
const publishDir = path.join(renderDir, 'publish')
const renderPjson = path.join(publishDir, 'package.json')
const buildDir = path.join(publishDir, 'lib')
const craName = 'cra'
const craDir = path.join(renderDir, craName)
const craSrcDir = path.join(craDir, 'src')
const craSrcIncDir = path.join(craSrcDir, 'inc')
const craAppJs = path.join(craSrcDir, 'App.js')
const craEnv = path.join(craDir, '.env')

const cssFile = path.join(craSrcIncDir, 'esm.css')
const cssImport = path.relative(craSrcDir, cssFile)
const appFile = path.join(craSrcIncDir, 'esm.js')
const appImport = path.relative(craSrcDir, appFile)


const srcReact = path.join(path.resolve(), 'src', 'react')

it('Transpile ECMAScript css svg', async () => {
  const twoMinutes = 1.2e5
  const fourMinutes = 2.4e5
  let t0

  const testTime = fourMinutes
  jest.setTimeout(testTime)

  if (!await fs.pathExists(reactRollup)) throw new Error(`Executable not present: was yarn build run? ${reactRollup}`)

  // populate tmp/render/src
  console.log('Preparing test project directory…')
  await fs.ensureDir(tmpDir)
  await fs.remove(renderDir)
  await fs.copy(srcReact, renderDir)
  const pFile = JSON.parse(await fs.readFile(renderPjson, 'utf8'))
  pFile.name += '-render'
  await fs.writeFile(renderPjson, JSON.stringify(pFile, null, '\x20\x20'))

  // build to tmp/render/publish/lib
  console.log(`Building to: ${path.relative(projectDir, buildDir)}`)
  await spawnAsync({
    args: [reactRollup],
    echo: true,
    options: {cwd: renderDir}
  })

  // create react app tmp/render/cra
  t0 = getT0('Create React App', twoMinutes)
  await spawnAsync({args: ['npx', 'create-react-app', craName], echo: true, options: {cwd: renderDir}})
  console.log(getElapsed(t0)) // 181210: 41 s

  // move builds into tmp/render/cra/src/lib, wire up
  console.log(`Writing files…`)
  await fs.copy(buildDir, craSrcIncDir)
  await fs.writeFile(craAppJs, [
    `import './${cssImport}'`,
    `export { App as default } from './${appImport}'`,
  ].join('\n'))
  await fs.writeFile(craEnv, 'SKIP_PREFLIGHT_CHECK=true')

  console.log(`test cra: (cd ${path.relative(projectDir, craDir)} && yarn start)`)

  function getMinutes(ms) {
    const minutes = Math.ceil(ms / 6e4)
    return minutes.toFixed(0)
  }
  function getT0(task, timeout) {
    console.log(`${task} (up to ${getMinutes(timeout)} min)…`)
    return {t0: Date.now(), task}
  }
  function getElapsed({t0, task}) {
    const elapsed = (Date.now() - t0) / 1e3
    return `${task}: ${elapsed.toFixed(1)} s`
  }
})
