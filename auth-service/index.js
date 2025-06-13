const micro = require('comm/micro')
const pkg = require('./package.json')
const {
    createService,
    withName,
} = micro

// Start the broker
createService(withName(pkg.name))
