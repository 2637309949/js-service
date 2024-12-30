const comm = require('comm')
const moleculer = comm.moleculer
const {
    createService,
    withName,
} = moleculer
const broker = createService(withName('user'))

// Start the broker
broker.start()
    .catch(err => broker.logger.error(err))