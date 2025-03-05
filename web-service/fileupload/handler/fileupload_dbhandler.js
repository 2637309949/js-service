const comm = require('comm')
const micro = comm.micro
const {
    withMethod
} = micro

withMethod({
    async queryFileDB(ctx, where, ...count) {
        const sequelize = this.sequelize
        const logger = this.withLogger(ctx)
        const options = { where, attributes: { exclude: ['deletedAt'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            logger.info(msg)
        }
        const File = sequelize.models.File
        let total = 0
        if (count.length > 0) {
            total = await File.count(options)
        }
        return [await File.findAll(options), total]
    }
})
