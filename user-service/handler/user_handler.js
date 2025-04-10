const comm = require('comm')
const micro = comm.micro
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = micro

withAction({
    queryUserDetail: {
        rest: 'GET /queryUserDetail',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const sequelize = this.initDb(ctx)
            const { id } = ctx.params
            const rsp = {}
            const where = { id }
            const user = await this.queryUserDetailDB(ctx, sequelize, where)
            if (!user) {
                throw new BusinessServerError(`用户[${id}]不存在`)
            }
            delete user.deletedAt
            delete user.password
            rsp.data = user
            return rsp
        },
    },
    queryUser: {
        auth: 'disabled',
        rest: 'GET /queryUser',
        handler: async function(ctx) {
            this.validate(ctx, 'username')
            const sequelize = this.initDb(ctx)
            const {
                username,
                userid,
                pageNo = 1,
                pageSize = 10 } = ctx.params
            const rsp = {}
            const where = { username, userid }
            const [users, total] = await this.queryUserDB(ctx, sequelize, where, null)
            rsp.data = users
            rsp.totalCount = total
            rsp.curPage = pageNo
            rsp.totalPage = (total / pageSize) | 0
            rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
            return rsp
        }
    },
    updateUser: {
        rest: 'POST /updateUser',
        handler: async function(ctx) {
            this.validate(ctx, 'id', 'username', 'email')
            const sequelize = this.initDb(ctx)
            const { id, username, email } = ctx.params
            const rsp = {}
            const where = { id }
            const updateFields = { id }
            if (username) updateFields.username = username
            if (email) updateFields.email = email
            const user = await this.queryUserDetailDB(ctx, sequelize, where)
            if (!user) {
                throw new BusinessServerError(`用户ID ${id} 不存在`)
            }

            const updatedUser = await this.updateUserDB(ctx, updateFields)
            if (!updatedUser) {
                throw new BusinessServerError('更新用户信息失败')
            }

            rsp.data = updateFields
            return rsp
        },
    },
    deleteUser: {
        rest: 'POST /deleteUser',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const sequelize = this.initDb(ctx)
            const id = ctx.params.id
            const rsp = {}
            const where = { id }
            await this.deleteUserDB(ctx, sequelize, where)
            rsp.data = where
            return rsp
        },
    },
    insertUser: {
        rest: 'POST /insertUser',
        handler: async function(ctx) {
            this.validate(ctx, 'username', 'email')
            const sequelize = this.initDb(ctx)
            const {
                username,
                email } = ctx.params
            const insertFields = {}
            if (username) insertFields.username = username
            if (email) insertFields.email = email

            const rsp = {}
            const where = { email }
            const user = await this.queryUserDetailDB(ctx, sequelize, where)
            if (user) {
                throw new BusinessServerError(`用户Email[${email}]已存在`)
            }
            const insertedUser = await this.insertUserDB(ctx, insertFields)
            if (!insertedUser) {
                throw new BusinessServerError('新增用户失败')
            }

            rsp.data = insertedUser
            return rsp
        },
    },
    saveUser: {
        rest: 'POST /saveUser',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const sequelize = this.initDb(ctx)
            const { id, name, email } = ctx.params
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

            const user = await this.queryUserDetailDB(ctx, sequelize, where)
            if (!user) {
                const insertedUser = await this.insertUserDB(ctx, sequelize, updateFields)
                if (!insertedUser) {
                    throw new BusinessServerError('新增用户失败')
                }
                rsp.data = insertedUser
            } else {
                updateFields.id = user.id
                const updatedUser = await this.updateUserDB(ctx, sequelize, updateFields)
                if (!updatedUser) {
                    throw new BusinessServerError('更新用户信息失败')
                }
                rsp.data = updateFields
            }
            return rsp
        }
    }
})
