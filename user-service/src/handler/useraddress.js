const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    queryUserAddress: {
        rest: 'GET /queryUserAddress',
        async handler(ctx) {
            this.check(ctx, 'userId')
            const {
                userId,
                pageNo = 1,
                pageSize = 10 } = ctx.params
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
    }
})
