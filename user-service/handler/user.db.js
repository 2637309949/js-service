const _ = require('lodash')
const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod,
    errors: {
        DatabaseServerError
    }
} = moleculer

withMethod({
    async queryUserDetailDB (ctx, sequelize, where) {
        try {
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User.splitTable(where)
            return await User.findOne(options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('queryUserDetailDB failed')
        }
    },
    async queryUserDB(ctx, sequelize, where, ...count) {
        try {
            const options = { where, attributes: { exclude: ['deletedAt', 'password', 'createdAt', 'updatedat'] } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User.splitTable(where)
            let total = 0
            if (count.length > 0) {
                total = await User.count(options)
            }
            return [await User.findAll(options), total]
        } catch (error) {
            console.log(error)
            this.error(ctx, error)
            throw new DatabaseServerError('queryUserDB failed')
        }
    },
    async updateUserDB(ctx, sequelize, user) {
        try {
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User.splitTable(where)
            return await User.update(user, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('updateUserDB failed')
        }
    },
    async deleteUserDB(ctx, sequelize, user) {
        try {
            const options = { where: { id: user.id } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User.splitTable(where)
            return User.update({ deletedAt: Date.now() / 1000 | 0 }, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('deleteUserDB failed')
        }
    },
    async insertUserDB(ctx, sequelize, user) {
        try {
            const options = {}
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User.splitTable(where)
            const ret = await User.create(user, options)
            return ret
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('insertUserDB failed')
        }
    }
})
