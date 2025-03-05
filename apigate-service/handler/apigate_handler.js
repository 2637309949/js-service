const comm = require('comm')
const moleculer = comm.moleculer
const {
    withMethod,
    errors: {
        UnAuthorizedError
    }
} = moleculer

withMethod({
    async authorize(ctx, route, req) {
        let token
        const host = req.headers.host
        if (req.headers.authorization) {
            let type = req.headers.authorization.split(' ')[0]
            if (type === 'Token' || type === 'Bearer')
                token = req.headers.authorization.split(' ')[1]
        }
        
        let user
        if (token) {
            try {
                user = await ctx.call('user.resolveToken', { token, host })
                if (user) {
                    ctx.meta.user = user
                    ctx.meta.token = token
                    ctx.meta.userID = user.id
                }
            } catch (err) {
                // Ignored because we continue processing if user doesn't exists
            }
        }
        
        if (req.$action.auth !== 'disabled' && !user)
            throw new UnAuthorizedError()
    }
})
