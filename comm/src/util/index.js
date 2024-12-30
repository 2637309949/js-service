const glob = require('./glob')

const rts = {}
rts.require = glob.require
module.exports = rts

