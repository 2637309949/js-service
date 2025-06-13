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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '用户ID',
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '角色ID',
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
    modelName('UserRole'),
    options({
        tableName: 't_user_role',
        timestamps: true
    })
)
