
let rts = {}
let methods = {}

rts.withMethod = function (method) {
    methods = {...methods, ...method}
}

rts.getMethods = function () {
    return methods
}

module.exports = rts
