/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { createFilter } from 'rollup-pluginutils'

export default class FileLoader {
  constructor(options) {
    const {include, exclude} = Object(options)
    this.filter = createFilter(include, exclude) // does not fail
  }

  /*resolveId = async (importee, importer) => {
    console.log('\nFileLoader.resolveId', importee, '\n')
  }*/

  /*load = async (id) => {
    const {filter} = this
    console.log('\nFileLoader.load', id, '\n')
    if (!filter(id)) return
  }*/

  /*generateBundle = async (outputOptions, bundle, isWrite) => {
    //const {modules} = bundle
    console.log('FileLoader.generateBundle',
      '\nmodules', Object.keys(bundle),
      '\nbundle', bundle,
      '\n\n\n')
  }*/
}
/*
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
*/
