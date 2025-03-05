const comm = require('comm')
const micro = comm.micro
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = micro

withAction({
    async push(ctx) {
        this.check(ctx, 'toUser', 'eventId', 'univeralStr', 'source')
        const { toUser, eventId, univeralStr, source } = ctx.params
        const rsp = {}
        return rsp
    }
})
