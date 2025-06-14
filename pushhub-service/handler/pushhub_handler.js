const micro = require('comm/micro')
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = micro

withAction({
    async push(ctx) {
        this.validate(ctx, 'toUser', 'eventId', 'univeralStr', 'source')
        const { toUser, eventId, univeralStr, source } = ctx.params
        const rsp = {}
        return rsp
    }
})
