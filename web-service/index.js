const comm = require('comm')
const moleculer = comm.moleculer
const {
    createWeb,
    withSchema
} = moleculer

// Start the broker
createWeb(withSchema({
    name: 'web',
    settings: {
        routes: [{
            path: "/api"
        }]
    }
}))
