const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        MoleculerError
    }
} = moleculer

withAction({
    async queryUserDetail(ctx) {
        const logger = this.withLogger(ctx)
        const { id } = ctx.params
        if (id === undefined) {
            logger.warn('id未设置')
            throw new MoleculerError('id未设置', 400, 'BAD_PARAMS')
        }
    
        const rsp = {}
        const where = { id }
        const user = await this.queryUserDetailDB(ctx, where)
        if (!user) {
            logger.warn(`用户ID ${id} 不存在`)
            throw new MoleculerError(`用户ID ${id} 不存在`, 400, 'BAD_PARAMS')
        }
    
        rsp.data = user
        return rsp
    },
    async queryUser(ctx) {
        const logger = this.withLogger(ctx)
        const {
            username,
            pageNo = 1,
            pageSize = 10 } = ctx.params
        if (username === undefined) {
            logger.warn('username未设置')
            throw new MoleculerError('username未设置', 400, 'BAD_PARAMS')
        }
        const rsp = {}
        const where = { username }
        const [users, total] = await this.queryUserDB(ctx, where, null)
        rsp.data = users
        rsp.totalCount = total
        rsp.curPage = pageNo
        rsp.totalPage = (total / pageSize) | 0
        rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
        return rsp
    }
})
