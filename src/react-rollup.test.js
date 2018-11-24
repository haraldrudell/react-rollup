/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
import { spawnAsync } from 'allspawn'

import path from 'path'

const reactDir = path.join(__dirname, 'react')
const reactRollup = path.join(__dirname, '..', 'bin', react-rollup)

it('Transpile ECMAScript css svg', async () => {
  spawnAsync({
    args: [reactRollup],
    echo: true,
    options: {cwd: reactDir}
  })
})
