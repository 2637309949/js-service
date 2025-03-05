const comm = require('comm')
const pkg = require('./package.json')
const micro = comm.micro
const {
    createCron,
    withName,
} = micro

// Start the broker
createCron(withName(pkg.name))
