const glob = require('./glob')
const uid = require('./uid')

function clearRequireCache(filename) {
    Object.keys(require.cache).forEach(function (key) {
        if (key == filename) {
            delete require.cache[key]
        }
    })
}

function makeDirs(p) {
    p.split(path.sep).reduce((prevPath, folder) => {
        const currentPath = path.join(prevPath, folder, path.sep)
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath)
        }
        return currentPath
    }, "")
}

function isFunction(fn) {
    return typeof fn === "function"
}

function isString(s) {
    return typeof s === "string" || s instanceof String
}

function isObject(o) {
    return o !== null && typeof o === "object" && !(o instanceof String)
}

function isPlainObject(o) {
    return o != null
        ? Object.getPrototypeOf(o) === Object.prototype || Object.getPrototypeOf(o) === null
        : false
}

function isDate(d) {
    return d instanceof Date && !Number.isNaN(d.getTime())
}

function isPromise(fn) {
    return (fn && typeof fn.then === 'function' && typeof fn.catch === 'function') || (fn && fn.constructor.name === 'AsyncFunction')
}

function uniq(arr) {
    return [...new Set(arr)]
}

module.exports.clearRequireCache = clearRequireCache
module.exports.makeDirs = makeDirs
module.exports.isFunction = isFunction
module.exports.isString = isString
module.exports.isObject = isObject
module.exports.isPlainObject = isPlainObject
module.exports.isDate = isDate
module.exports.isPromise = isPromise
module.exports.uniq = uniq

Object.assign(module.exports, uid)
Object.assign(module.exports, glob)

