const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        MoleculerError
    }
} = moleculer

// http://localhost:3000/api/user/queryUser?username=123
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
    },
    async updateUser(ctx) {
        const logger = this.withLogger(ctx)
        const {
            id,
            username,
            email } = ctx.params
        if (id === undefined ) {
            logger.warn('id未设置')
            throw new MoleculerError('id未设置', 400, 'BAD_PARAMS')
        }
        if (username === undefined && email === undefined) {
            logger.warn('至少提供一个更新字段，如name或email')
            throw new MoleculerError('至少提供一个更新字段，如name或email', 400, 'BAD_PARAMS')
        }
    
        const rsp = {}
        const where = { id }
        const updateFields = { id }
        if (username) updateFields.username = username
        if (email) updateFields.email = email
        const user = await this.queryUserDetailDB(ctx, where)
        if (!user) {
            throw new MoleculerError(`用户ID ${id} 不存在`, 500)
        }
    
        const updatedUser = await this.updateUserDB(ctx, updateFields)
        if (!updatedUser) {
            throw new MoleculerError('更新用户信息失败', 500)
        }
    
        rsp.data = updateFields
        return rsp
    },
    async deleteUser(ctx) {
        const { id } = ctx.params
        if (id == undefined) {
            logger.warn('id未设置')
            throw new MoleculerError('id未设置', 400, 'BAD_PARAMS')
        }
        const rsp = {}
        const where = { id }
        await this.deleteUserDB(ctx, where)
        rsp.data = where
        return rsp
    },
    async insertUser(ctx) {
        const { 
            username, 
            email } = ctx.params
        if (username == undefined) {
            logger.warn('username未设置')
            throw new MoleculerError('username未设置', 400, 'BAD_PARAMS')
        }
        if (email == undefined) {
            logger.warn('email未设置')
            throw new MoleculerError('email未设置', 400, 'BAD_PARAMS')
        }
    
        const insertFields = {}
        if (username) insertFields.username = username
        if (email) insertFields.email = email
    
        const rsp = {}
        const where = { email }
        const user = await this.queryUserDetailDB(ctx, where)
        if (user) {
            logger.warn(`用户Email ${email} 已存在`)
            throw new MoleculerError(`用户Email ${email} 已存在`, 500)
        }
        const insertedUser = await this.insertUserDB(ctx, insertFields)
        if (!insertedUser) {
            logger.warn('新增用户失败')
            throw new MoleculerError('新增用户失败', 500)
        }
    
        rsp.data = insertedUser
        return rsp
    },
    async saveUser(ctx) {
        const { 
            id, 
            name, 
            email } = ctx.params
        if (username == undefined) {
            logger.warn('username未设置')
            throw new MoleculerError('username未设置', 400, 'BAD_PARAMS')
        }
        if (email == undefined) {
            logger.warn('email未设置')
            throw new MoleculerError('email未设置', 400, 'BAD_PARAMS')
        }
    
        const updateFields = {}
        if (name) updateFields.name = name
        if (email) updateFields.email = email
    
        const rsp = {}
        const where = {}
        if (id) {
            where.id = id
        } else {
            where.email = email
        }
    
        const user = await this.queryUserDetailDB(ctx, where)
        if (!user) {
            const insertedUser = await this.insertUserDB(ctx, updateFields)
            if (!insertedUser) {
                logger.warn('新增用户失败')
                throw new MoleculerError('新增用户失败', 500)
            }
            rsp.data = insertedUser
        } else {
            updateFields.id = user.id
            const updatedUser = await this.updateUserDB(ctx, updateFields)
            if (!updatedUser) {
                logger.warn('更新用户信息失败')
                throw new MoleculerError('更新用户信息失败', 500)
            }
            rsp.data = updateFields
        }
        return rsp
    }
})
