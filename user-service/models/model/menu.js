const sequelize = require('comm/sequelize')
const moment = require('moment')
const DataTypes = sequelize.DataTypes
const {
    define,
    modelName,
    attributes,
    options,
    sync
} = sequelize.define

define(
    attributes({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: '唯一标识ID',
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '上级菜单',
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '名称',
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '标题',
        },
        icon: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: 'ICON',
        },
        path: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '路径',
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            comment: '状态',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '创建时间',
            get() {
                const date = this.getDataValue('createdAt')
                return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            comment: '更新时间',
            get() {
                const date = this.getDataValue('updatedAt')
                return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null
            }
        }
    }),
    sync(false),
    modelName('Menu'),
    options({
        tableName: 't_menu',
        timestamps: true
    })
)
