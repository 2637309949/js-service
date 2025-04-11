const comm = require('comm')
const path = require('path')
const fs = require('fs')
const process = require('process')
const { register } = require('module')
const micro = comm.micro
const {
    withAction,
} = micro

withAction({
    login: {
        handler: async function(ctx) {
            ctx.meta.$responseType = "text/html; charset=UTF-8"
            const filePath = path.join(process.cwd(), '/public/login.html')
            return fs.createReadStream(filePath)
        },
    },
    register: {
        handler: async function(ctx) {
            ctx.meta.$responseType = "text/html; charset=UTF-8"
            const filePath = path.join(process.cwd(), '/public/register.html')
            return fs.createReadStream(filePath)
        },
    }
})
