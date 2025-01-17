const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod,
    errors: {
        DatabaseServerError
    }
} = moleculer

withMethod({
    async queryUserDetailDB (ctx, where) {
        try {
            const sequelize = this.sequelize
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User
            return await User.findOne(options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('queryUserDetailDB failed')
        }
    },
    async queryUserDB(ctx, where, ...count) {
        try {
            const sequelize = this.sequelize
            const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User
            let total = 0
            if (count.length > 0) {
                total = await User.count(options)
            }
            return [await User.findAll(options), total]
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('queryUserDB failed')
        }
    },
    async updateUserDB(ctx, user) {
        try {
            const sequelize = this.sequelize
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User
            return await User.update(user, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('updateUserDB failed')
        }
    },
    async deleteUserDB(ctx, user) {
        try {
            const sequelize = this.sequelize
            const options = { where: { id: user.id } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User
            return User.update({ deletedAt: Date.now() / 1000 | 0 }, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('deleteUserDB failed')
        }
    },
    async insertUserDB(ctx, user) {
        try {
            const sequelize = this.sequelize
            const options = {}
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const User = sequelize.models.User
            const ret = await User.create(user, options)
            return ret
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('insertUserDB failed')
        }
    }
})
