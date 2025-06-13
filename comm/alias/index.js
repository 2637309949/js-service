const BuiltinModule = require('module')
const fs = require('fs')
const {
  globSync
} = require('glob')

// Guard against poorly mocked module constructors
let Module = module.constructor.length > 1
  ? module.constructor
  : BuiltinModule

let nodePath = require('path')
const { createBrotliCompress } = require('zlib')

let modulePaths = []
let moduleAliases = {}
let moduleAliasNames = []
let moduleRequires = []

let oldNodeModulePaths = Module._nodeModulePaths
Module._nodeModulePaths = function (from) {
  let paths = oldNodeModulePaths.call(this, from)

  // Only include the module path for top-level modules
  // that were not installed:
  if (from.indexOf('node_modules') === -1) {
    paths = modulePaths.concat(paths)
  }

  return paths
}

let oldResolveFilename = Module._resolveFilename
Module._resolveFilename = function (request, parentModule, isMain, options) {
  for (let i = moduleAliasNames.length; i-- > 0;) {
    let alias = moduleAliasNames[i]
    if (isPathMatchesAlias(request, alias)) {
      let aliasTarget = moduleAliases[alias]
      // Custom function handler
      if (typeof moduleAliases[alias] === 'function') {
        let fromPath = parentModule.filename
        aliasTarget = moduleAliases[alias](fromPath, request, alias)
        if (!aliasTarget || typeof aliasTarget !== 'string') {
          throw new Error('[module-alias] Expecting custom handler function to return path.')
        }
      }
      request = nodePath.join(aliasTarget, request.substr(alias.length))
      // Only use the first match
      break
    }
  }

  return oldResolveFilename.call(this, request, parentModule, isMain, options)
}

function isPathMatchesAlias (path, alias) {
  // Matching /^alias(\/|$)/
  if (path.indexOf(alias) === 0) {
    if (path.length === alias.length) return true
    if (path[alias.length] === '/') return true
  }

  return false
}

function addPathHelper (path, targetArray) {
  path = nodePath.normalize(path)
  if (targetArray && targetArray.indexOf(path) === -1) {
    targetArray.unshift(path)
  }
}

function removePathHelper (path, targetArray) {
  if (targetArray) {
    let index = targetArray.indexOf(path)
    if (index !== -1) {
      targetArray.splice(index, 1)
    }
  }
}

function addPath (path) {
  let parent
  path = nodePath.normalize(path)

  if (modulePaths.indexOf(path) === -1) {
    modulePaths.push(path)
    // Enable the search path for the current top-level module
    let mainModule = getMainModule()
    if (mainModule) {
      addPathHelper(path, mainModule.paths)
    }
    parent = module.parent

    // Also modify the paths of the module that was used to load the
    // app-module-paths module and all of it's parents
    while (parent && parent !== mainModule) {
      addPathHelper(path, parent.paths)
      parent = parent.parent
    }
  }
}

function addAliases (aliases) {
  for (let alias in aliases) {
    addAlias(alias, aliases[alias])
  }
}

function addAlias (alias, target) {
  moduleAliases[alias] = target
  // Cost of sorting is lower here than during resolution
  moduleAliasNames = Object.keys(moduleAliases)
  moduleAliasNames.sort()
}

/**
 * Reset any changes maded (resets all registered aliases
 * and custom module directories)
 * The function is undocumented and for testing purposes only
 */
function reset () {
  let mainModule = getMainModule()

  // Reset all changes in paths caused by addPath function
  modulePaths.forEach(function (path) {
    if (mainModule) {
      removePathHelper(path, mainModule.paths)
    }

    // Delete from require.cache if the module has been required before.
    // This is required for node >= 11
    Object.getOwnPropertyNames(require.cache).forEach(function (name) {
      if (name.indexOf(path) !== -1) {
        delete require.cache[name]
      }
    })

    let parent = module.parent
    while (parent && parent !== mainModule) {
      removePathHelper(path, parent.paths)
      parent = parent.parent
    }
  })

  modulePaths = []
  moduleAliases = {}
  moduleAliasNames = []
  moduleRequires = []
}

/**
 * Import aliases from package.json
 * @param {object} options
 */
function init (options) {
  if (typeof options === 'string') {
    options = { base: options }
  }

  options = options || {}

  let candidatePackagePaths
  if (options.base) {
    candidatePackagePaths = [nodePath.resolve(options.base.replace(/\/package\.json$/, ''))]
  } else {
    // There is probably 99% chance that the project root directory in located
    // above the node_modules directory,
    // Or that package.json is in the node process' current working directory (when
    // running a package manager script, e.g. `yarn start` / `npm run start`)
    candidatePackagePaths = [nodePath.join(__dirname, '../..'), process.cwd()]
  }

  let npmPackage
  let base
  for (let i in candidatePackagePaths) {
    try {
      base = candidatePackagePaths[i]
      npmPackage = require(nodePath.join(base, 'package.json'))
      break
    } catch (e) {
      // noop
    }
  }

  if (typeof npmPackage !== 'object') {
    let pathString = candidatePackagePaths.join(',\n')
    throw new Error('Unable to find package.json in any of:\n[' + pathString + ']')
  }

  //
  // Import aliases
  //
  let aliases = npmPackage._moduleAliases || {}

  for (let alias in aliases) {
    if (aliases[alias][0] !== '/') {
      aliases[alias] = nodePath.join(base, aliases[alias])
    }
  }

  addAliases(aliases)

  //
  // Register custom module directories (like node_modules)
  //
  if (npmPackage._moduleDirectories instanceof Array) {
    npmPackage._moduleDirectories.forEach(function (dir) {
      if (dir === 'node_modules') return
      let modulePath = nodePath.join(base, dir)
      addPath(modulePath)
    })
  }

  //
  // Require custom directories
  //
  if (npmPackage._moduleRequires instanceof Array) {
    npmPackage._moduleRequires.forEach(async (mr) => {
      if (mr === 'node_modules') return
      const jsfiles = globSync(mr, { ignore: 'node_modules/**' })
      jsfiles.forEach((mr) => {
        moduleRequires.push(nodePath.join(base, mr))
        require(nodePath.join(base, mr))
      })
    })
  }
}

function getMainModule () {
  return require.main._simulateRepl ? undefined : require.main
}

function buildAlias (options) {
  const currentDir = options || process.cwd()
  const relativePaths = moduleRequires.map(abs => {
    return nodePath.relative(currentDir, abs).replace(/\\+/g, '/')
  })
  const requireStatements = relativePaths
    .map(relativePath => `require('./${relativePath}')`)
    .join('\n')
  const outputFilePath = nodePath.join(currentDir, 'alias.js')
  fs.writeFileSync(outputFilePath, requireStatements, 'utf8')
}

module.exports = init
module.exports.init = init
module.exports.addPath = addPath
module.exports.addAlias = addAlias
module.exports.addAliases = addAliases
module.exports.isPathMatchesAlias = isPathMatchesAlias
module.exports.reset = reset
module.exports.moduleRequires = moduleRequires
module.exports.buildAlias = buildAlias