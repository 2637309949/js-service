const micro = require('comm/micro')
const pkg = require('./package.json')
const {
    createCron,
    withName,
} = micro

// Start the broker
createCron(withName(pkg.name))
