const comm = require('comm')
const micro = comm.micro
const {
    withAction
} = micro

withAction({
    queryUserAddress: {
        rest: 'GET /queryUserAddress',
        handler: async function(ctx) {
            this.validate(ctx, 'userId')
            const sequelize = this.initDb(ctx)
            const {
                userId,
                pageNo = 1,
                pageSize = 10 } = ctx.params
            const rsp = {}
            const where = { userId }
            const [users, total] = await this.queryUserAddressDB(ctx, sequelize, where, null)
            rsp.data = users
            rsp.totalCount = total
            rsp.curPage = pageNo
            rsp.totalPage = (total / pageSize) | 0
            rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
            return rsp
        }
    }
})
