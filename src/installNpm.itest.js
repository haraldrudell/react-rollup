/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { spawnAsync } from 'allspawn'

import fs from 'fs-extra'

import path from 'path'

const projectDir = path.resolve()
const fsDir = path.join(projectDir, 'tmp', 'from-npm')

it('Install via file system', async () => {
  const twoMinutes = 1.2e5
  let t0, timeout

  const testTime = twoMinutes
  jest.setTimeout(testTime)

  // create an empty project
  console.log(`Emptying: ${fsDir}`)
  await fs.emptyDir(fsDir)

  await spawnAsync({args: ['yarn', 'init', '--yes'], echo: true, options: {silent: true, cwd: fsDir}})

  // install the package from fs
  t0 = getT0('Install from fs', timeout = twoMinutes)
  await spawnAsync({args: ['yarn', 'add', 'react-rollup'], echo: true, options: {cwd: fsDir}})
  console.log(getElapsed(t0)) // 181124: 47 s

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
