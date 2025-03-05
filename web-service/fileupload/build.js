const fs = require('fs')
const path = require('path')
const comm = require('comm')
const pkg = require('./package.json')
const name = pkg.name
const outputFile = `./${name}.ncc`
const entryFile = './index.js'
const alias = comm.alias.moduleRequires
const nccLoc = path.join(require.resolve('comm'), "../../cmd/ncc")
const ncc = require(nccLoc)

ncc(entryFile, {
    cache: false,
    externals: ["externalpackage"],
    filterAssetBase: process.cwd(),
    minify: false,
    sourceMap: false,
    assetBuilds: false,
    sourceMapBasePrefix: '../',
    sourceMapRegister: true,
    watch: false,
    target: 'es2015',
    v8cache: false,
    quiet: false,
    debugLog: false,
    alias
}).then(({ code, map, assets }) => {
      fs.writeFileSync(outputFile, code, 'utf8')
})