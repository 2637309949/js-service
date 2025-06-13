const sequelize = require('comm/sequelize')
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
        type: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            comment: '类型(0：系统角色 1：自定义角色)',
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '名称',
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '编码',
        },
        remark: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '备注',
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
    modelName('Role'),
    options({
        tableName: 't_role',
        timestamps: true
    })
)
