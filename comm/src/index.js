require('dotenv').config({ path: ['../.env', '.env'] })
const alias = require('./alias')
const moleculer = require('./moleculer')
const sequelize = require('./sequelize')

module.exports.moleculer = moleculer
module.exports.sequelize = sequelize
module.exports.alias = alias

// for nopacked
if (eval('typeof __unused_webpack_exports') === 'undefined') {
    alias.init(process.cwd())
}
