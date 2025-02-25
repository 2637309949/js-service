const Consul = require('Consul')
const { CONSUL = "127.0.0.1:8500" } = process.env
const [ host, port ] = CONSUL.split(":")

const consul = new Consul({
    host,
    port
})

async function get(key) {
    let value = await consul.kv.get(key)
    if (value) {
        value = JSON.parse(value.Value)
        return value
    }
}

async function CommConf (k) {
    const key = 'micro/config/comm'
    let value = await get(key)
    if (value) {
        return k === undefined ? value : value[k]
    }
}

async function Conf (name, k) {
    const splits = ['micro', 'config', 'service']
    splits.push(name)
    const key = splits.join('/')
    let value = await get(key)
    if (value) {
        return k === undefined ? value : value[k]
    }
}

module.exports.CommConf = CommConf
module.exports.Conf = Conf

