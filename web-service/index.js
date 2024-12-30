const comm = require('comm')
const ApiService = require("moleculer-web")
const moleculer = comm.moleculer
const {
    createService,
    withSchema
} = moleculer
const broker = createService(withSchema({
    name: 'web',
    mixins: [ApiService],
    settings: {
        routes: [{
            path: "/api"
        }]
    }
}))

// Start the broker
broker.start()
    .catch(err => broker.logger.error(err))