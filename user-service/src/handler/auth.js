const comm = require('comm')
const jwt = require('jsonwebtoken')
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
    resolveToken: {
        cache: {
            keys: ['authorization'],
            ttl: 60 * 60 // 1 hour
        },
        params: {
            token: 'string'
        },
        visibility: 'public', // 不暴露网关
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
