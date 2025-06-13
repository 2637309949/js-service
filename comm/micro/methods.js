
let methods = {}

function withMethod(method) {
    methods = {...methods, ...method}
}

function getMethods() {
    return methods
}

module.exports.getMethods = getMethods
module.exports.withMethod = withMethod
