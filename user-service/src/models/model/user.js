const sequelize = require('comm').sequelize
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
        username: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '姓名',
        },
        nickname: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '别名',
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '头像',
        },
        gender: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            comment: '性别(1:男,2:女)',
        },
        birthday: {
            type: DataTypes.DATE,
            defaultValue: new Date(0),
            allowNull: false,
            comment: '出生日期',
            get() {
                const date = this.getDataValue('birthday')
                return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null
            }
        },
        email: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '邮箱',
        },
        isEmailVerified: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            comment: '是否验证邮箱',
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false,
            comment: '密码',
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
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
    modelName('User'),
    associate(function (User, models) {
        // User.hasMany(models.Article)
    }),
    options({
        tableName: 't_user',
        timestamps: true
    })
)
