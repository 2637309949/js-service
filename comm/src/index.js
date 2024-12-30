const moleculer = require('./moleculer')
const sequelize = require('./sequelize')

const rts = {}
rts.moleculer = moleculer
rts.sequelize = sequelize
module.exports = rts
require('./alias')(process.cwd())