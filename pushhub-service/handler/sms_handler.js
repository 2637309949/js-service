const micro = require('comm/micro')
const {
    withAction,
    errors: {
        BusinessServerError
    }
} = micro

withAction({
    querySmsDetail: {
        rest: 'GET /querySmsDetail',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const { id } = ctx.params
            const rsp = {}
            const where = { id }
            const sms = await this.querySmsDetailDB(ctx, where)
            if (!sms) {
                throw new BusinessServerError(`消息[${id}]不存在`)
            }
            delete sms.deletedAt
            delete sms.password
            rsp.data = sms
            return rsp
        },
    },
    querySms: {
        rest: 'GET /querySms',
        handler: async function(ctx) {
            this.validate(ctx, 'type')
            const {
                type,
                pageNo = 1,
                pageSize = 10 } = ctx.params
            const rsp = {}
            const where = { type }
            const [smss, total] = await this.querySmsDB(ctx, where, null)
            rsp.data = smss
            rsp.totalCount = total
            rsp.curPage = pageNo
            rsp.totalPage = (total / pageSize) | 0
            rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
            return rsp
        }
    },
    updateSms: {
        rest: 'POST /updateSms',
        handler: async function(ctx) {
            this.validate(ctx, 'id', 'from', 'to')
            const { id, from, to, content } = ctx.params
            const rsp = {}
            const where = { id }
            const updateFields = { id }
            if (from) updateFields.from = from
            if (to) updateFields.to = to
            if (content) updateFields.content = content
            const sms = await this.querySmsDetailDB(ctx, where)
            if (!sms) {
                throw new BusinessServerError(`消息ID ${id} 不存在`)
            }

            const updatedSms = await this.updateSmsDB(ctx, updateFields)
            if (!updatedSms) {
                throw new BusinessServerError('更新消息失败')
            }

            rsp.data = updateFields
            return rsp
        },
    },
    deleteSms: {
        rest: 'POST /deleteSms',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const id = ctx.params.id
            const rsp = {}
            const where = { id }
            await this.deleteSmsDB(ctx, where)
            rsp.data = where
            return rsp
        },
    },
    insertSms: {
        rest: 'POST /insertSms',
        handler: async function(ctx) {
            this.validate(ctx, 'desc', 'content', 'from', 'to')
            const {
                desc,
                content,
                from,
                to } = ctx.params
            const insertFields = {}
            if (desc) insertFields.desc = desc
            if (content) insertFields.content = content
            if (from) insertFields.from = from
            if (to) insertFields.to = to

            const rsp = {}
            const insertedSms = await this.insertSmsDB(ctx, insertFields)
            if (!insertedSms) {
                throw new BusinessServerError('新增消息失败')
            }

            rsp.data = insertedSms
            return rsp
        },
    },
    saveSms: {
        rest: 'POST /saveSms',
        handler: async function(ctx) {
            this.validate(ctx, 'id')
            const { id, 
                content,
                from,
                to } = ctx.params
            const updateFields = {}
            if (content) insertFields.content = content
            if (from) insertFields.from = from
            if (to) insertFields.to = to
            const rsp = {}
            const where = {}
            let sms
            if (id) {
                where.id = id
                sms = await this.querySmsDetailDB(ctx, where)
            }

            if (!sms) {
                const insertedSms = await this.insertSmsDB(ctx, updateFields)
                if (!insertedSms) {
                    throw new BusinessServerError('新增消息失败')
                }
                rsp.data = insertedSms
            } else {
                updateFields.id = sms.id
                const updatedSms = await this.updateSmsDB(ctx, updateFields)
                if (!updatedSms) {
                    throw new BusinessServerError('更新消息信息失败')
                }
                rsp.data = updateFields
            }
            return rsp
        }
    }
})
