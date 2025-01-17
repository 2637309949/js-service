const comm = require('comm')
const moleculer = comm.moleculer
const {
    createWeb,
    withSchema,
    errors: {
        UnAuthorizedError
    }
} = moleculer

const port = process.env.PORT || 3000
// Start the broker
createWeb(withSchema({
    name: 'apigate',
    settings: {
        port,
        routes: [{
            path: "/api",
            cors: true,
            autoAliases: true,
            authorization: true,
            onBeforeCall(ctx, route, req, res) {
                ctx.meta.userAgent = req.headers["user-agent"]
            },
        },
        {
            path: "/upload",
            cors: true,
            aliases: {
                "POST /multipart": "multipart:file.multipart",
                "POST /stream": "stream:file.stream",
            }
        }],
        assets: {
            folder: "./public",
            options: { index: ['index.html', 'index.htm'] }
        }
    },
    methods: {
        async authorize(ctx, route, req) {
            let token
            if (req.headers.authorization) {
                let type = req.headers.authorization.split(" ")[0]
                if (type === "Token" || type === "Bearer")
                    token = req.headers.authorization.split(" ")[1]
            }
            
            let user
            if (token) {
                try {
                    user = await ctx.call("user.resolveToken", { token })
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
    }
}))
