const comm = require('comm')
const fs = require("fs-extra")
const path = require("path")
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    // File upload from HTML multipart form
    async multipart(ctx) {
        const hostName = 'http://localhost:3000'
        const fileStream = ctx.params
        const { fieldname, filename, encoding, mimetype, $multipart } = ctx.meta
        // contains the additional text form-data fields must be sent before other files fields
        const { scene } = $multipart
        const fileExtension = path.extname(filename)
        const fileId = `${Date.now()}${Math.random().toString(36).slice(2, 9)}${fileExtension}`
        const fileLoc = path.join(process.cwd(), '../web-service/public/files')
        const filePath = path.join(fileLoc, fileId)
        const fileUrl = `${hostName}/files/${fileId}`
        const writeStream = fs.createWriteStream(filePath)
        fileStream.pipe(writeStream)
        return {
            message: "File uploaded successfully",
            fileName: filename,
            fileUrl
        }
    },
    // File upload from AJAX or cURL
    async stream(ctx) {
        return
    },
    // 生成签名url, 签名直传
    async ossSignURL(ctx) {
        return
    }
})
