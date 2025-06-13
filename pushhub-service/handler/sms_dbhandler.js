const micro = require('comm/micro')
const {
    withMethod,
    errors: {
        DatabaseServerError
    }
} = micro

withMethod({
    async querySmsDetailDB (ctx, where) {
        try {
            const sequelize = this.sequelize
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const Sms = sequelize.models.Sms
            return await Sms.findOne(options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('querySmsDetailDB failed')
        }
    },
    async querySmsDB(ctx, where, ...count) {
        try {
            const sequelize = this.sequelize
            const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const Sms = sequelize.models.Sms
            let total = 0
            if (count.length > 0) {
                total = await Sms.count(options)
            }
            return [await Sms.findAll(options), total]
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('querySmsDB failed')
        }
    },
    async updateSmsDB(ctx, sms) {
        try {
            const sequelize = this.sequelize
            const options = { where }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const Sms = sequelize.models.Sms
            return await Sms.update(sms, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('updateSmsDB failed')
        }
    },
    async deleteSmsDB(ctx, sms) {
        try {
            const sequelize = this.sequelize
            const options = { where: { id: sms.id } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const Sms = sequelize.models.Sms
            return Sms.update({ deletedAt: Date.now() / 1000 | 0 }, options)
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('deleteSmsDB failed')
        }
    },
    async insertSmsDB(ctx, sms) {
        try {
            const sequelize = this.sequelize
            const options = {}
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const Sms = sequelize.models.Sms
            const ret = await Sms.create(sms, options)
            return ret
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('insertSmsDB failed')
        }
    }
})
