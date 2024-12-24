const Consul = require('Consul')
const rts = {}
const {
    CONSUL_HOST,
    CONSUL_PORT
} = process.env

const consul = new Consul({
    host: CONSUL_HOST,
    port: CONSUL_PORT
})

rts.get = async (key) => {
    let value = await consul.kv.get(key)
    if (value) {
        value = JSON.parse(value.Value)
        return value
    }
}

module.exports = rts
