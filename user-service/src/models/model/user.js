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
        id: {
            type: DataTypes.INTEGER,
            field: 'FUID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: '唯一标识ID',
        },
        userid: {
            type: DataTypes.INTEGER,
            field: 'Fuser_id',
            allowNull: false,
            comment: '用户ID',
        },
        username: {
            type: DataTypes.STRING,
            field: 'Fuser_name',
            defaultValue: '',
            allowNull: false,
            comment: '姓名',
        },
        nickname: {
            type: DataTypes.STRING,
            field: 'Fnick_name',
            defaultValue: '',
            allowNull: false,
            comment: '别名',
        },
        sex: {
            type: DataTypes.TINYINT,
            field: 'Fsex',
            allowNull: false,
            comment: '性别',
        },
        age: {
            type: DataTypes.INTEGER,
            field: 'Fage',
            allowNull: false,
            comment: '年龄',
        },
        phone: {
            type: DataTypes.INTEGER,
            field: 'Fphone',
            allowNull: false,
            comment: '号码',
        },
        email: {
            type: DataTypes.STRING,
            field: 'Femail',
            defaultValue: '',
            allowNull: false,
            comment: '邮箱',
        }
    }),
    sync(false),
    modelName('User'),
    options({
        tableName: 't_user',
        timestamps: true
    })
)
