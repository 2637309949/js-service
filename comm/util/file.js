const path = require('path')
const fs = require('fs')
const process = require('process')
const R = require('ramda')

function createReadStream(ctx, fp, t) {
    if (t) {
        ctx.meta.$responseType = t
    }
    fp = path.join(process.cwd(), fp)
    return fs.createReadStream(fp)
}

module.exports.createReadStream = createReadStream
module.exports.createReadStreamR = R.curryN(3, (fp, t, ctx) => createReadStream(ctx, fp, t))
