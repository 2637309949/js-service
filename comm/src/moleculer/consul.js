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

rts.CommConf = async (k) => {
    const key = 'micro/config/common'
    let value = await rts.get(key)
    if (value) {
        return k === undefined ? value : value[k]
    }
}

rts.Conf = async (name, k) => {
    const splits = ['micro', 'config', 'service']
    splits.push(name)
    const key = splits.join('/')
    let value = await rts.get(key)
    if (value) {
        return k === undefined ? value : value[k]
    }
}

module.exports = rts
