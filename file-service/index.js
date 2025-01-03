const comm = require('comm')
const moleculer = comm.moleculer
const {
    createService,
    withName,
} = moleculer

// Start the broker
createService(withName('file'))
