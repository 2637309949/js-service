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
        this.info(ctx, 'queryUserDetail invoked')
        const err = this.check(ctx, 'id')
        if (err) {
            throw err
        }
        const { id } = ctx.params
        const rsp = {}
        const where = { id }
        const user = await this.queryUserDetailDB(ctx, where)
        if (!user) {
            this.warn(ctx, `用户[${id}]不存在`)
            throw new MoleculerError(`用户[${id}]不存在`, 400, 'BAD_PARAMS')
        }
        rsp.data = user
        return rsp
    },
    async queryUser(ctx) {
        this.info(ctx, 'queryUser invoked')
        const err = this.check(ctx, 'username')
        if (err) {
            throw err
        }
        const {
            username,
            pageNo = 1,
            pageSize = 10 } = ctx.params
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
        this.info(ctx, 'queryUser invoked')
        const err = this.check(ctx, 'id', 'username', 'email')
        if (err) {
            throw err
        }
        const {
            id,
            username,
            email } = ctx.params
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
        this.info(ctx, 'deleteUser invoked')
        const err = this.check(ctx, 'id', 'username', 'email')
        if (err) {
            throw err
        }
        const { id } = ctx.params
        if (id == undefined) {
            this.warn(ctx, '[id]不能为空')
            throw new MoleculerError('[id]不能为空', 400, 'BAD_PARAMS')
        }
        const rsp = {}
        const where = { id }
        await this.deleteUserDB(ctx, where)
        rsp.data = where
        return rsp
    },
    async insertUser(ctx) {
        this.info(ctx, 'insertUser invoked')
        const err = this.check(ctx, 'username', 'email')
        if (err) {
            throw err
        }
        const { 
            username, 
            email } = ctx.params
        const insertFields = {}
        if (username) insertFields.username = username
        if (email) insertFields.email = email
    
        const rsp = {}
        const where = { email }
        const user = await this.queryUserDetailDB(ctx, where)
        if (user) {
            this.warn(ctx, `用户Email[${email}]已存在`)
            throw new MoleculerError(`用户Email[${email}]已存在`, 500)
        }
        const insertedUser = await this.insertUserDB(ctx, insertFields)
        if (!insertedUser) {
            this.warn(ctx, '新增用户失败')
            throw new MoleculerError('新增用户失败', 500)
        }
    
        rsp.data = insertedUser
        return rsp
    },
    async saveUser(ctx) {
        this.info(ctx, 'saveUser invoked')
        const err = this.check(ctx, 'id')
        if (err) {
            throw err
        }
        const { 
            id, 
            name, 
            email } = ctx.params
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
                this.warn(ctx, '新增用户失败')
                throw new MoleculerError('新增用户失败', 500)
            }
            rsp.data = insertedUser
        } else {
            updateFields.id = user.id
            const updatedUser = await this.updateUserDB(ctx, updateFields)
            if (!updatedUser) {
                this.warn(ctx, '更新用户信息失败')
                throw new MoleculerError('更新用户信息失败', 500)
            }
            rsp.data = updateFields
        }
        return rsp
    }
})
