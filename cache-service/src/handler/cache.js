const comm = require('comm')
const moleculer = comm.moleculer
const {
    withAction
} = moleculer

withAction({
    async set(ctx) {
        this.check(ctx, 'key', 'value')
        const { key, value, ttl } = ctx.params
        this.info(ctx, `key[${key}] value[${value} ttl[${ttl}]`)
        return this.set(key, value, ttl)
    },
    async mset(ctx) {
        this.check(ctx, 'list')
        const { list } = ctx.params
        return this.mset(list)
    },
    async get(ctx) {
        this.check(ctx, 'key')
        const { key } = ctx.params
        return this.get(key)
    },
    async mget(ctx) {
        this.check(ctx, 'keys')
        const { keys } = ctx.params
        return this.mget(keys)
    },
    async ttl(ctx) {
        this.check(ctx, 'key')
        const { key } = ctx.params
        return this.ttl(key)
    },
    async del(ctx) {
        this.check(ctx, 'key')
        const { key } = ctx.params
        return this.del(key)
    },
    async mdel(ctx) {
        this.check(ctx, 'keys')
        const { keys } = ctx.params
        return this.mdel(keys)
    }
})
