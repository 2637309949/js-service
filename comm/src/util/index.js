const glob = require('./glob')

const rts = {}
rts.require = glob.require

rts.clearRequireCache = function (filename) {
    Object.keys(require.cache).forEach(function (key) {
        if (key == filename) {
            delete require.cache[key]
        }
    })
}

rts.makeDirs = function makeDirs(p) {
    p.split(path.sep).reduce((prevPath, folder) => {
        const currentPath = path.join(prevPath, folder, path.sep)
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath)
        }
        return currentPath
    }, "")
}

rts.isFunction = function isFunction(fn) {
    return typeof fn === "function"
}

rts.isString = function isString(s) {
    return typeof s === "string" || s instanceof String
}

rts.isObject = function isObject(o) {
    return o !== null && typeof o === "object" && !(o instanceof String)
}

rts.isPlainObject = function isPlainObject(o) {
    return o != null
        ? Object.getPrototypeOf(o) === Object.prototype || Object.getPrototypeOf(o) === null
        : false
}

rts.isDate = function isDate(d) {
    return d instanceof Date && !Number.isNaN(d.getTime())
}

rts.isPromise = function (fn) {
    return (fn && typeof fn.then === 'function' && typeof fn.catch === 'function') || (fn && fn.constructor.name === 'AsyncFunction')
}

rts.uniq = function uniq(arr) {
    return [...new Set(arr)]
}

module.exports = rts
