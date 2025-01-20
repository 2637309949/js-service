const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = moleculer

withAction({
    async push(ctx) {
        this.check(ctx, 'toUser', 'eventId', 'univeralStr', 'source')
        const { toUser, eventId, univeralStr, source } = ctx.params
        const rsp = {}
        return rsp
    }
})
