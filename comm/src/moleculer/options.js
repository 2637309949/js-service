const _ = require("lodash")
const consul = require('./consul')
const mixins = require('./mixins')
const util = require('../util')

function withBrokerOptions (brokerOptions) {
    return function (s) {
        s.brokerOptions = _.merge(s.brokerOptions, brokerOptions)
    }
}

function withSchema (schema) {
    return function (s) {
        s.schema = _.merge(s.schema, schema)
    }
}

function withName (name) {
    return function (s) {
        s.schema.name = name
    }
}

function withActions (actions) {
    return function (s) {
        Object.assign(s.schema.actions, actions)
    }
}

function withMethods (methods) {
    return function (s) {
        Object.assign(s.schema.methods, methods)
    }
}

function withCrons (...crons) {
    return async function (s) {
        const cc = await consul.CommConf()
        crons.forEach(cron => {
            if (util.isString(cron.env) && cron.env !== cc.env) {
                return
            }
            if (Array.isArray(cron.env) && !cron.env.includes(cc.env)) {
                return
            }
            s.schema.settings.cronJobs.push(cron)
            s.schema.actions[cron.name] = cron.onTick
        })
    }
}

function withMixins (...mixins) {
    return function (s) {
        s.schema.mixins = s.schema.mixins.concat(mixins)
    }
}

function withSettings (setting) {
    return function (s) {
        Object.assign(s.schema.settings, setting)
    }
}

module.exports.withBrokerOptions = withBrokerOptions
module.exports.withName = withName
module.exports.withSchema = withSchema
module.exports.withActions = withActions
module.exports.withMethods = withMethods
module.exports.withCrons = withCrons
module.exports.withMixin = mixins.withMixin
module.exports.withMixins = withMixins
module.exports.withSettings = withSettings
