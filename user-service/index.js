require('./src/models/model')
require('./src/models/api')
require('./src/handler')
const comm = require('comm')
const moleculer = comm.moleculer
const {
    createService,
    withSchema,
    getActions,
    getMethods,
} = moleculer
const actions = getActions()
const methods = getMethods()
const broker = createService(withSchema({
    name: "user",
    actions,
    methods
}))

// Start the broker
broker.start()
    .catch(err => console.error(`Error occured! ${err.message}`))