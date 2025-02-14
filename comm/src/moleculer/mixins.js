const Sequelize = require('sequelize')
const csl = require('./consul')
const define = require('../sequelize/define')
let rts = {}
let mixins = []

rts.consul = {
    name: 'consul',
    async started() {
    },
    methods: {
        async CommConf(k) {
            return csl.CommConf(k)
        },
        async Conf(k) {
            return csl.Conf(this.name, k)
        }
    }
}

rts.sequelize = {
    name: 'sequelize',
    async started() {
        const db = await this.Conf('db')
        if (!db) return
        const { uri, pool } = db
        const logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            this.logger.info(msg)
        }
        const sequelize = new Sequelize(uri, { pool, logging })
        await sequelize.authenticate()
        this.logger.info('Sequelize has been established successfully')
        this.sequelize = sequelize
        const defines = define.getDefines()
        defines.forEach(d => {
            const { associate, sync, modelName, attributes, options } = d
            const model = sequelize.define(
                modelName,
                attributes,
                options,
            )
            if (sync) model.sync()
            associate.forEach(funk => {
                funk(model, sequelize.models)
            })
        })
    },
    methods: {
    }
}

rts.withMixin = function (mixin) {
    mixins.push(mixin)
}

rts.getMixins = function () {
    return mixins
}

module.exports = rts
