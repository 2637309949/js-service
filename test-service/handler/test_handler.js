const comm = require('comm')
const micro = comm.micro
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = micro

withAction({
    querySmsDetail: {
        rest: 'GET /querySmsDetail',
        auth: 'disabled',
        async handler(ctx) {
            return rsp
        },
    }
})
