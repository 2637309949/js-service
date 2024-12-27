const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod
} = moleculer

withMethod({
    async queryUserDetailDB (ctx, where) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const User = sequelize.models.User
        return User.findOne(options)
    },
    async queryUserDB(ctx, where, ...count) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const User = sequelize.models.User
        let total = 0
        if (count.length > 0) {
            total = await User.count(options)
        }
        return [await User.findAll(options), total]
    },
    async updateUserDB(ctx, user) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const User = sequelize.models.User
        return User.update(user, options)
    },
    async deleteUserDB(ctx, user) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where: { id: user.id } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const User = sequelize.models.User
        return User.update({ deletedAt: Date.now() / 1000 | 0 }, options)
    },
    async insertUserDB(ctx, user) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = {}
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const User = sequelize.models.User
        const ret = await User.create(user, options)
        return ret
    }
})
