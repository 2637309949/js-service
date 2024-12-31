const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    async queryUserAddress(ctx) {
        const logger = this.withLogger(ctx)
        const {
            userId,
            pageNo = 1,
            pageSize = 10 } = ctx.params
        if (userId === undefined) {
            logger.warn('userId未设置')
            throw new MoleculerError('userId未设置', 400, 'BAD_PARAMS')
        }
        const rsp = {}
        const where = { userId }
        const [users, total] = await this.queryUserAddressDB(ctx, where, null)
        rsp.data = users
        rsp.totalCount = total
        rsp.curPage = pageNo
        rsp.totalPage = (total / pageSize) | 0
        rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
        return rsp
    }
})
