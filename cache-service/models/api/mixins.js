const micro = require('comm/micro')
const {
    withMixin
} = micro

withMixin({
    name: 'cache-manager',
    async started() {
        const { createCache } = await import('cache-manager')
        const { Keyv } = await import('keyv')
        const cache = createCache({
            stores: [new Keyv()],
        })
        cache.set
        this.cache = cache
    },
    methods: {
        get(key){
            return this.cache.get(key)
        },
        mget(keys){
            return this.cache.mget(keys)
        },
        ttl(key){
            return this.cache.ttl(key)
        },
        set(key, value, ttl){
            return this.cache.set(key, value, ttl)
        },
        mset(list){
            return this.cache.mset(list)
        },
        del(key){
            return this.cache.del(key)
        },
        mdel(keys){
            return this.cache.mdel(keys)
        },
    }
})
