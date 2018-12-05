/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { spawnAsync } from 'allspawn'

import path from 'path'

const rollupConfigJs = path.join(__dirname, 'rollup.config.js')
const rollup = path.join(__dirname, '..', 'node_modules', '.bin', 'rollup')

runRollup({rollup, rollupConfigJs}).catch(errorHandler)

async function runRollup({rollup, rollupConfigJs}) {
  return spawnAsync({
    args: [rollup, '--config', rollupConfigJs],
    echo: true,
  })
}

function errorHandler(e) {
  console.error(e)
  process.exit(1)
}
