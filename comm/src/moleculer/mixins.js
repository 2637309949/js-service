const Sequelize = require('sequelize')
const crypto = require('crypto')
const csl = require('./consul')
const define = require('../sequelize/define')
let mixins = []
const keyb64 = 'EsWSXS3S56C6p8jWT99g/w=='

function decryptPassword(passwdBase64) {
    const key = Buffer.from(keyb64)
    const encryptedData = Buffer.from(passwdBase64, 'base64')
    const decipher = crypto.createDecipheriv('des-ede3', key, null)
    decipher.setAutoPadding(true) // PKCS5/PKCS7 填充
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString('utf8')
}

const consul = {
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

const sequelize = {
    name: 'sequelize',
    async started() {
        let conns = []
        let dbs = {}
        let od = []
        let db = await this.Conf('db')
        if (!db) return
        db = db.map(x => {
            x.passwd = decryptPassword(x.passwd)
            return x
        })
        db.forEach(v => {
            let c = {uri: `mysql://${v.user}:${v.passwd}@${v.host}:${v.port}/${v.db}`}
            c.db = v.db
            c.pool = 20
            c.charset = 'utf8mb4'
            c.parseTime = 'true'
            c.loc = 'Local'
            conns.push(c)
        })
        const logging = msg => {
            const sqlMatch = msg.match(/^Executing \(default\): (.*?);?$/)
            msg = sqlMatch ? sqlMatch[1] : msg
            this.logger.info(msg)
        }
        for (let i = 0; i < conns.length; i++) {
            const v = conns[i]
            const sequelize = new Sequelize(v.uri, { pool: v.pool, logging })
            await sequelize.authenticate()
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
            if (!dbs[v.db]) {
                od.push(v.db)
            }
            dbs[v.db] = dbs[v.db] || []
            dbs[v.db].push(sequelize)
        }
        this.logger.info('Sequelize has been established successfully')
        this.conns = conns
        this.dbs = dbs
        this.od = od
    },
    methods: {
        initDb(ctx, ...keys) {
            const key = keys.length > 0 ? keys[0] : 0
            const dbName = this.od[0]
            console.log(666, dbName)
            const dbs = this.dbs[dbName]
            const sequelize = dbs[key % dbs.length]
            return sequelize
        },
        initDbAssDb(ctx, dbName, ...keys) {
            const key = keys.length > 0 ? keys[0] : 0
            const dbs = this.dbs[dbName]
            const sequelize = dbs[key % dbs.length]
            return sequelize
        }
    }
}

function withMixin (mixin) {
    mixins.push(mixin)
}

function getMixins() {
    return mixins
}

module.exports.consul = consul
module.exports.sequelize = sequelize
module.exports.withMixin = withMixin
module.exports.getMixins = getMixins
