const fs = require('fs')
const comm = require('comm')
const npmPackage = require('./package.json')

const entryFile = './index.js'
const outputFile = `./${npmPackage.name}.ncc`
const alias = comm.alias.moduleRequires

const vercelNcc = require.resolve('@vercel/ncc', { paths: [process.env.NPM_CONFIG_PREFIX + '/node_modules'] })
require(vercelNcc)(entryFile, {
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