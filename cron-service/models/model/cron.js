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
        name: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '名称',
        },
        env: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '环境',
        },
        cronTime: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '表达式',
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
    modelName('Cron'),
    options({
        tableName: 't_cron',
        timestamps: true
    })
)
