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
    }
})
