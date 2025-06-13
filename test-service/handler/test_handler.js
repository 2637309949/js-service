const micro = require('comm/micro')
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
        handler: async function(ctx) {
            return rsp
        },
    }
})
