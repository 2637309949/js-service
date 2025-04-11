const comm = require('comm')
const pkg = require('./package.json')
const micro = comm.micro
const {
    createWeb,
    withSettings,
    withName
} = micro

const port = process.env.PORT || 3000

// Start the broker
createWeb(
    withName(pkg.name),
    withSettings({
        port,
        routes: [{
            path: '/api',
            cors: true,
            autoAliases: true,
            authorization: true,
            onBeforeCall(ctx, route, req, res) {
                ctx.meta.headers = req.headers
                ctx.meta.host = req.headers['host']
                ctx.meta.authorization = req.headers['authorization']
                ctx.meta.userAgent = req.headers['user-agent']
            },
        },
        {
            path: '/upload',
            authorization: false,
            cors: true,
            aliases: {
                'POST /multipart': 'multipart:file.multipart',
                'POST /stream': 'stream:file.stream',
            }
        },
        {
            path: '',
            authorization: false,
            aliases: {
                'GET /login': 'apigate.login',
                'GET /register': 'apigate.register',
            }
        }],
        assets: {
            folder: './public',
            options: { index: ['index.html', 'index.htm'] }
        }
    })
)
