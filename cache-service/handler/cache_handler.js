const micro = require('comm/micro')
const {
    withAction
} = micro

withAction({
    async set(ctx) {
        this.validate(ctx, 'key', 'value')
        const { key, value, ttl } = ctx.params
        this.info(ctx, `key[${key}] value[${value} ttl[${ttl}]`)
        return this.set(key, value, ttl)
    },
    async mset(ctx) {
        this.validate(ctx, 'list')
        const { list } = ctx.params
        return this.mset(list)
    },
    async get(ctx) {
        this.validate(ctx, 'key')
        const { key } = ctx.params
        return this.get(key)
    },
    async mget(ctx) {
        this.validate(ctx, 'keys')
        const { keys } = ctx.params
        return this.mget(keys)
    },
    async ttl(ctx) {
        this.validate(ctx, 'key')
        const { key } = ctx.params
        return this.ttl(key)
    },
    async del(ctx) {
        this.validate(ctx, 'key')
        const { key } = ctx.params
        return this.del(key)
    },
    async mdel(ctx) {
        this.validate(ctx, 'keys')
        const { keys } = ctx.params
        return this.mdel(keys)
    }
})
