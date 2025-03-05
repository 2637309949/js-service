const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    async queryCron(ctx) {
        const logger = this.withLogger(ctx)
        const {
            name,
            pageNo = 1,
            pageSize = 10 } = ctx.params
        const rsp = {}
        const where = { name }
        const [users, total] = await this.queryCronDB(ctx, where, null)
        rsp.data = users
        rsp.totalCount = total
        rsp.curPage = pageNo
        rsp.totalPage = (total / pageSize) | 0
        rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
        return rsp
    }
})
