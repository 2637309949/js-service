const comm = require('comm')
const pkg = require('./package.json')
const moleculer = comm.moleculer
const {
    createService,
    withName,
} = moleculer

// Start the broker
createService(withName(pkg.name))
