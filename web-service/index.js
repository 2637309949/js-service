const comm = require('comm')
const moleculer = comm.moleculer
const {
    createWeb,
    withSchema
} = moleculer

// Start the broker
createWeb(withSchema({
    name: 'web',
    settings: {
        routes: [{
            path: "/api",
            onBeforeCall(ctx, route, req, res) {
                ctx.meta.userAgent = req.headers["user-agent"]
            },
        },
        {
            path: "/upload",
            aliases: {
                "POST /multipart": "multipart:file.multipart",
                "POST /stream": "stream:file.stream",
            }
        }],
        assets: {
            folder: "./public",
            options: { index: ['index.html', 'index.htm'] }
        }
    }
}))
