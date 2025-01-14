const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod
} = moleculer

withMethod({
    async queryUserAddressDB(ctx, where, ...count) {
        const sequelize = this.sequelize
        const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
        options.logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            this.info(ctx, msg)
        }
        const UserAddress = sequelize.models.UserAddress
        let total = 0
        if (count.length > 0) {
            total = await UserAddress.count(options)
        }
        return [await UserAddress.findAll(options), total]
    }
})
