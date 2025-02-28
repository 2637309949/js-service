const _ = require('lodash')
const Sequelize = require('sequelize')
const mysql2 = require('mysql2')

// for ncc build
Sequelize.addHook('beforeInit', (config, options) => {
    switch (options.dialect) {
        case 'mysql':
            options.dialectModule = mysql2
            break
        default:
            break
    }
})

const defines = []
const defaultOpts = {
    attributes: {
    },
    options: {
        timestamps: false,
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        defaultScope: {
            where: {
            },
        }
    },
    associate: [],
    addHook: [],
    sync: false
}

function getDefines () {
    return defines
}

function define (...options) {
    return defines[defines.push(options.reduce((acc, curr) => {
        curr(acc)
         return acc 
     }, {...defaultOpts}))-1]
}

function modelName (modelName) {
    return (opt) => {
        opt.modelName = modelName
    }
}

function attributes (attributes) {
    return (opt) => {
        opt.attributes = { ...opt.attributes, ...attributes }
    }
}

function options (options) {
    return (opt) => {
        opt.options = { ...opt.options, ...options }
    }
}

function associate (associate) {
    return (opt) => {
        opt.associate.push(associate)
    }
}

function addHook (addHook) {
    return (opt) => {
        opt.addHook.push(addHook)
    }
}

function sync (flag) {
    return (opt) => {
        opt.sync = flag
    }
}

module.exports.getDefines = getDefines
module.exports.define = define
module.exports.modelName = modelName
module.exports.attributes = attributes
module.exports.options = options
module.exports.associate = associate
module.exports.addHook = addHook
module.exports.sync = sync

