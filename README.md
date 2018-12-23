# React-Rollup

The React build pipeline ported to [Rollup](https://rollupjs.org)

[click for **Video presentation**, 10 min](https://youtu.be/KVaOVjiH2SQ)

Used by [lib-create-react-app](https://github.com/haraldrudell/lib-create-react-app)

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

&emsp;

### Usage

This project mainly supports lib-create-react-app

It does provide a rollup preset for React that allows for transpiling a React app with css into distributable files

**yarn add --dev react-rollup**

In rollup.config.js:
<blockquote><strong>import rollupPresetReact from 'react-rollup'<br />
…<br />
export default {input, output, external, plugins: rollupPresetReact(options)}</strong></blockquote>

options:

* **jail**: for rollup-plugin-resolve
* **assetsPath**: directory to where assets like fonts are copied

### Components
* [react-rollup](https://github.com/haraldrudell/react-rollup.git) the [Create React App](https://github.com/facebook/create-react-app) build pipeline ported to [Rollup](https://rollupjs.org)
* [lib-create-react-app](https://github.com/haraldrudell/lib-create-react-app) that adapts, builds and publishes a React project to npm
* [es2049package](https://github.com/haraldrudell/ECMAScript2049/tree/master/workspace/packages/es2049package) a configuration-free bundler for CommonJS and ECMAScript modules

&emsp;

### Example Project
* [demo-context-store](https://github.com/haraldrudell/demo-context-store.git) a single-truth store in 94% less code lines

&emsp;

## link: [Hire Harald Rudell](https://hire.surge.sh/)

## link: [Sponsor Harald Rudell](https://www.gofundme.com/san-francisco-revenge-crime-victim/)

&emsp;

**[Lib Create React App](https://github.com/haraldrudell/lib-create-react-app)** creates shareable libraries from projects bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## © 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
