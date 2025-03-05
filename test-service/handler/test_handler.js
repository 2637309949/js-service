const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = moleculer

withAction({
    querySmsDetail: {
        rest: 'GET /querySmsDetail',
        auth: 'disabled',
        async handler(ctx) {
            return rsp
        },
    }
})
