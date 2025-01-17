const comm = require('comm')
const jwt = require("jsonwebtoken")
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = moleculer

withAction({
    queryUserDetail: {
        rest: 'GET /queryUserDetail',
        async handler(ctx) {
            this.check(ctx, 'id')
            const { id } = ctx.params
            const rsp = {}
            const where = { id }
            const user = await this.queryUserDetailDB(ctx, where)
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
        rest: 'GET /queryUser',
        async handler(ctx) {
            this.check(ctx, 'username')
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
        }
    },
    updateUser: {
        rest: 'POST /updateUser',
        async handler(ctx) {
            this.check(ctx, 'id', 'username', 'email')
            const { id, username, email } = ctx.params
            const rsp = {}
            const where = { id }
            const updateFields = { id }
            if (username) updateFields.username = username
            if (email) updateFields.email = email
            const user = await this.queryUserDetailDB(ctx, where)
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
        async handler(ctx) {
            this.check(ctx, 'id')
            const id = ctx.params.id
            const rsp = {}
            const where = { id }
            await this.deleteUserDB(ctx, where)
            rsp.data = where
            return rsp
        },
    },
    insertUser: {
        rest: 'POST /insertUser',
        async handler(ctx) {
            this.check(ctx, 'username', 'email')
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
        async handler(ctx) {
            this.check(ctx, 'id')
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

            const user = await this.queryUserDetailDB(ctx, where)
            if (!user) {
                const insertedUser = await this.insertUserDB(ctx, updateFields)
                if (!insertedUser) {
                    throw new BusinessServerError('新增用户失败')
                }
                rsp.data = insertedUser
            } else {
                updateFields.id = user.id
                const updatedUser = await this.updateUserDB(ctx, updateFields)
                if (!updatedUser) {
                    throw new BusinessServerError('更新用户信息失败')
                }
                rsp.data = updateFields
            }
            return rsp
        }
    }
})
