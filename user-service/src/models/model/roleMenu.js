const sequelize = require('comm').sequelize
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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '角色ID',
        },
        menuId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '菜单ID',
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
    modelName('RoleMenu'),
    options({
        tableName: 't_role_menu',
        timestamps: true
    })
)
