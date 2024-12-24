const { DataTypes } = require('sequelize')
const defines = []
const rts = {}
const defaultOpts = {
    attributes: {
        total: {
            type: DataTypes.VIRTUAL
        },
        deletedAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    },
    options: {
        timestamps: false,
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        defaultScope: {
            where: {
                deletedAt: 0,
            },
        },
    },
    associate: [],
    addHook: [],
    sync: false
}

rts.getDefines = () => {
    return defines
}

rts.define = (...options) => {
    return defines[defines.push(options.reduce((acc, curr) => {
        curr(acc)
         return acc 
     }, {...defaultOpts}))-1]
}

rts.modelName = (modelName) => {
    return (opt) => {
        opt.modelName = modelName
    }
}

rts.attributes = (attributes) => {
    return (opt) => {
        opt.attributes = { ...opt.attributes, ...attributes }
    }
}

rts.options = (options) => {
    return (opt) => {
        opt.options = { ...opt.options, ...options }
    }
}

rts.associate = (associate) => {
    return (opt) => {
        opt.associate.push(associate)
    }
}

rts.addHook = (addHook) => {
    return (opt) => {
        opt.addHook.push(addHook)
    }
}

rts.sync = (flag) => {
    return (opt) => {
        opt.sync = flag
    }
}

module.exports = rts
