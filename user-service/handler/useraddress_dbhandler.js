const comm = require('comm')
const micro = comm.micro
const {
    withMethod,
    errors: {
        DatabaseServerError
    }
} = micro

withMethod({
    async queryUserAddressDB(ctx, sequelize, where, ...count) {
        try {
            const options = { where, attributes: { exclude: ['deletedAt', 'password'] } }
            options.logging = msg => {
                const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
                msg = sqlMatch ? sqlMatch[1] : msg
                this.info(ctx, msg.toLowerCase())
            }
            const UserAddress = sequelize.models.UserAddress
            let total = 0
            if (count.length > 0) {
                total = await UserAddress.count(options)
            }
            return [await UserAddress.findAll(options), total]
        } catch (error) {
            this.error(ctx, error)
            throw new DatabaseServerError('queryUserDetailDB failed')
        }
    }
})
