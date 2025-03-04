const comm = require('comm')
const pkg = require('./package.json')
const moleculer = comm.moleculer
const {
    createCron,
    withName,
} = moleculer

// Start the broker
createCron(withName(pkg.name))
