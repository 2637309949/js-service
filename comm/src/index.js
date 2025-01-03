require('dotenv').config({ path: ['../.env', '.env'] })
const alias = require('./alias')
const moleculer = require('./moleculer')
const sequelize = require('./sequelize')

const rts = {}
rts.moleculer = moleculer
rts.sequelize = sequelize
module.exports = rts

alias.init(process.cwd())
