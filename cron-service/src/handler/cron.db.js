const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod
} = moleculer

withMethod({
    async queryCronDB(ctx, where, ...count) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where, attributes: { exclude: ['deletedAt'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const Cron = sequelize.models.Cron
        let total = 0
        if (count.length > 0) {
            total = await Cron.count(options)
        }
        return [await Cron.findAll(options), total]
    }
})
