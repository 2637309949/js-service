const comm = require('comm')
const micro = comm.micro
const {
    withAction
} = micro

withAction({
    async userInfo(ctx) {
        const hostName = 'http://localhost:3000'
        const fileId = `${Date.now()}${Math.random().toString(36).slice(2, 9)}${fileExtension}`
        const fileUrl = `${hostName}/files/download/${fileId}`
        return {
            message: "File download successfully",
            fileName: '',
            fileUrl: fileUrl
        }
    }
})
