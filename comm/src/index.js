require('dotenv').config({ 
    path: ['../.env', '.env'] 
})
const alias = require('./alias')
const moleculer = require('./moleculer')
const sequelize = require('./sequelize')
const util = require('./util')
const unused = 'typeof __unused_webpack_exports'

module.exports.moleculer = moleculer
module.exports.sequelize = sequelize
module.exports.alias = alias
module.exports.util = util

// for nopacked
// 必须在comm加载后再去init，避免出现循环依赖异常
if (eval(unused) === 'undefined') {
    alias.init(process.cwd())
}
