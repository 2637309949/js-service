const sequelize = require('comm/sequelize')
const DataTypes = sequelize.DataTypes
const {
    define,
    modelName,
    attributes,
    associate,
    options,
    sync
} = sequelize.define
const moment = require('moment')

define(
    attributes({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: '唯一标识ID',
        },
        desc: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '描述',
        },
        content: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '内容',
        },
        from: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '发送端',
        },
        to: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '接收端',
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            comment: '发送状态',
        },
        except: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '异常',
        },
        type: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            comment: '类型',
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
    modelName('Sms'),
    associate(function (Sms, models) {
        // Sms.hasMany(models.Article)
    }),
    options({
        tableName: 't_sms',
        timestamps: true
    })
)
