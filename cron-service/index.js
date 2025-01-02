const comm = require('comm')
const moleculer = comm.moleculer
const {
    createCron,
    withName,
} = moleculer

// Start the broker
createCron(withName('cron'))
