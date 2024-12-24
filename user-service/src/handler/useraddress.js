const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    async queryUserAddress(ctx) {
        const logger = this.withLogger(ctx)
        logger.info(">>> queryUserAddress ok!")
        return 'ok'
    }
})
