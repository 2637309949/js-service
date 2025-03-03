const comm = require('comm')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const moleculer = comm.moleculer
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = moleculer

withAction({
    login: {
        auth: 'disabled',
        rest: 'POST /login',
        desc: '通用登录接口,实际可根据不同的scope进行不同的登录逻辑',
        async handler(ctx) {
            this.check(ctx, 'email', 'password', 'verificationCode')
            const { email, password, verificationCode } = ctx.params

            const loginVerificationCode = await ctx.call('cache.get', { key: this.getLoginVerificationCode(email) })
            if (loginVerificationCode != verificationCode) {
                throw new BusinessServerError('验证码错误!', 61000, [{ field: 'verificationCode', message: 'is wrong' }])
            }

            let where = { email }
            let user = await this.queryUserDetailDB(ctx, where)
            if (!user) {
                throw new BusinessServerError('邮箱或密码错误!', 61000, [{ field: 'email', message: 'is not found' }])
            }
            const res = await this.comparePassword(password, user.password)
            if (!res)
                throw new BusinessServerError('邮箱或密码错误!', 61000, [{ field: 'email', message: 'is not found' }])

            const rsp = {}
            const today = new Date()
            const exp = new Date(today)
            const authSecret = await this.CommConf('authSecret')
            exp.setHours(5, 0, 0, 0)
            exp.setDate(today.getDate() + 1)
            const expired = Math.floor(exp.getTime() / 1000)
            user = { userId: user.id, userName: user.username }
            const token = jwt.sign({
                id: user.id,
                exp: expired
            }, authSecret)
            user.token = token
            user.expired = expired
            rsp.data = user
            return rsp
        },
    },
    register: {
        auth: 'disabled',
        rest: 'POST /register',
        desc: '通用注册接口,实际可根据不同的scope进行不同的注册逻辑',
        async handler(ctx) {
            this.check(ctx, 'email', 'username', 'password', 'verificationCode')
            const { email, username, verificationCode } = ctx.params

            const registedVerificationCode = await ctx.call('cache.get', { key: this.getRegistedVerificationCode(email) })
            if (registedVerificationCode != verificationCode) {
                throw new BusinessServerError('验证码错误!', 61000, [{ field: 'verificationCode', message: 'is wrong' }])
            }

            const where = { email }
            let user = await this.queryUserDetailDB(ctx, where)
            if (user) {
                throw new BusinessServerError(`邮箱 ${email} 已存在`)
            }

            user = { email, username }
            user.password = this.hashPassword(password)
            user.createdAt = new Date()
            user = await this.insertUserDB(ctx, user)
            if (!user) {
                throw new BusinessServerError('新增用户失败')
            }

            const rsp = {}
            const today = new Date()
            const exp = new Date(today)
            const authSecret = await this.CommConf('authSecret')
            exp.setHours(5, 0, 0, 0)
            exp.setDate(today.getDate() + 1)
            const expired = Math.floor(exp.getTime() / 1000)
            user = { userId: user.id, userName: user.username }
            const token = jwt.sign({
                id: user.id,
                exp: expired
            }, authSecret)
            user.token = token
            user.expired = expired
            rsp.data = user
            return rsp
        },
    },
    sendVerificationCode: {
        auth: 'disabled',
        rest: 'POST /sendVerificationCode',
        async handler(ctx) {
            this.check(ctx, 'scene')
            this.checkOr(ctx, 'email', 'phone')
            const { email, phone, scene } = ctx.params
            let verificationCodeId
            if (email) {
                verificationCodeId = email
            } else if (phone) {
                verificationCodeId = phone
            }

            let verificationCodeKey
            let univeralStr
            let eventId
            switch (scene) {
                case 101: //注册
                    eventId = 'registed'
                    verificationCodeKey = this.getRegistedVerificationCode(verificationCodeId)
                    break
                case 102: //登录
                    eventId = 'login'
                    verificationCodeKey = this.getLoginVerificationCode(verificationCodeId)
                    break
                case 103: //找回密码
                    break
                default:
                    break;
            }

            // 控制发送频率
            const verificationCodeKeyTTL = await ctx.call('cache.ttl', { key: verificationCodeKey })
            if (verificationCodeKeyTTL) {
                const currentTime = moment()
                const differenceInSeconds = moment(verificationCodeKeyTTL).diff(currentTime, 'seconds')
                throw new BusinessServerError(`请等待${differenceInSeconds}秒后再操作!`, 61000, [{ field: 'verificationCode', message: 'is wrong' }])
            }
            const verificationCode = this.genVerificationCode()
            await ctx.call('cache.set', { key: verificationCodeKey, value: verificationCode, ttl: 60000 })
            this.info(ctx, `scene[${scene}] verificationCode[${verificationCode}]`)

            // 推送消息
            const source = {
                from:     this.name,
				Desc:     eventId,
				UniqueId: `${this.name}${Date.now()}`,
            }
            await ctx.call('sms.push', { toUser: verificationCodeId, eventId, univeralStr, source })
            const rsp = {}
            rsp.expired = 60000
            return rsp
        }
    },
    resolveToken: {
        cache: {
            keys: ['authorization'],
            ttl: 60 * 60 // 1 hour
        },
        params: {
            token: 'string'
        },
        visibility: 'public', // 不暴露网关
        desc: '通用鉴权中间件,实际可根据不同的host进行不同的鉴权逻辑',
        async handler(ctx) {
            const token = ctx.params.token
            const authSecret = await this.CommConf('authSecret')
            const decoded = await new this.Promise((resolve, reject) => {
                jwt.verify(token, authSecret, (err, decoded) => {
                    if (err)
                        return reject(err)
                    resolve(decoded)
                })
            })
            if (decoded?.id) {
                const where = { id: decoded.id }
                const user = await this.queryUserDetailDB(ctx, where)
                return {
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    email: user.email,
                    status: user.status
                }
            }
        }
    }
})
