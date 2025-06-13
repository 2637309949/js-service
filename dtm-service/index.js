const comm = require('comm')
const pkg = require('./package.json')
const micro = comm.micro
const {
    createService,
    withName,
} = micro

// Start the broker
createService(withName(pkg.name))
