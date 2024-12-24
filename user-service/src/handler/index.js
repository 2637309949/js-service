const comm = require('comm')
const moleculer = comm.moleculer
const {
    getActions
} = moleculer 
require('./user')
require('./user.db')
require('./useraddress')

module.exports = getActions()
