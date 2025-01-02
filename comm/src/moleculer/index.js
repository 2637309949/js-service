require('dotenv').config()
const _ = require("lodash")
const { ServiceBroker, Middlewares } = require('moleculer')
const ApiService = require("moleculer-web")
const consul = require('./consul')
const mixins = require('./mixins')
const actions = require('./actions')
const methods = require('./methods')
const errors = require('./errors')
const middlewares = require('./middlewares')
const path = require('path')
const chalk = require('chalk')

let rts = {
    ...actions,
    ...methods,
    errors
}

rts.createService = async function (...opts) {
    const ccf = await consul.CommConf()
    let c = {
        broker: {
            namespace: ccf.env,
            hotReload: ccf.env === 'dev' || ccf.env === 'test',
            logLevel: 'info',
            logger: [
                {
                    type: "Console",
                    options: {
                        level: "info",
                        formatter: (level, args, bindings, { printArgs }) => {
                            const date = new Date
                            const year = date.getFullYear()
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const day = String(date.getDate()).padStart(2, '0')
                            const hours = String(date.getHours()).padStart(2, '0')
                            const minutes = String(date.getMinutes()).padStart(2, '0')
                            const seconds = String(date.getSeconds()).padStart(2, '0')
                            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                            const msg = printArgs(args).join(" ")
                            const levelColor = {
                                fatal: chalk.bgRed.white,
                                error: chalk.red,           
                                warn: chalk.yellow,         
                                info: chalk.green,          
                                debug: chalk.blue,          
                                trace: chalk.cyan,    
                            }[level]
                            const coloredLevel = levelColor ? levelColor(level.toUpperCase()) : level.toUpperCase()
                            return [`[${timestamp}]`, coloredLevel, msg]
                        }
                    }
                },
                {
                    type: "File",
                    options: {
                        level: "info",
                        folder: "C:\\Users\/Doubl\/Desktop\/logs",
                        filename: "{date}.log",
                        formatter: (level, args, bindings, { printArgs }) => {
                            const date = new Date
                            const year = date.getFullYear()
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const day = String(date.getDate()).padStart(2, '0')
                            const hours = String(date.getHours()).padStart(2, '0')
                            const minutes = String(date.getMinutes()).padStart(2, '0')
                            const seconds = String(date.getSeconds()).padStart(2, '0')
                            const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                            const msg = printArgs(args).join(" ")
                            return [`[${timestamp}]`, level.toUpperCase(), msg]
                        }
                    }
                },
            ],
            tracing: true,
            // graceful service shutdowns
            tracking: {
                enabled: true,
                shutdownTimeout: 18 * 1000
            },
            transporter: 'nats://172.30.12.14:4222',
            registry: {
                discoverer: {
                    type: "Redis",
                    options: {
                        redis: {
                            port: 6560,
                            host: "172.30.12.123",
                            password: "360gst.com",
                            db: 3
                        }
                    }
                }
            }
        },
        schema: {
            name: 'N/A',
            mixins: [mixins.consul, mixins.sequelize],
            settings: {},
            methods: {
                withLogger(ctx = {}) {
                    const logger = this.logger
                    const handler = {
                        get(target, prop, receiver) {
                            return function (...args) {
                                logger[prop](...args, ctx.requestID)
                            }
                        }
                    }
                    return new Proxy({}, handler)
                }
            },
            actions:{}
        }
    }

    opts.push(rts.withActions(actions.getActions()))
    opts.push(rts.withMethods(methods.getMethods()))
    for (let i = 0; i < opts.length; i++) {
        let opt = opts[i]
        opt(c)
    }

    // redefined folder
    const [, file] = c.broker.logger
    file.options.folder = path.join(file.options.folder, c.schema.name)
    // global c
    c.schema.settings.c = c

    // rewrite 
    Middlewares.HotReload = middlewares.HotReloadMiddleware
    const broker = new ServiceBroker(c.broker)
    broker.createService(c.schema)
    broker.start()
    .catch(err => broker.logger.error(err))
    return broker
}

rts.createWeb = function (...opts) {
    return rts.createService(rts.withMixins(ApiService), ...opts)
}

rts.withBrokerOptions = function (brokerOptions) {
    return function (s) {
        s.brokerOptions = _.merge(s.brokerOptions, brokerOptions)
    }
}

rts.withSchema = function (schema) {
    return function (s) {
        s.schema = _.merge(s.schema, schema)
    }
}

rts.withName = function (name) {
    return function (s) {
        s.schema.name = name
    }
}

rts.withActions = function (actions) {
    return function (s) {
        Object.assign(s.schema.actions, actions)
    }
}

rts.withMethods = function (methods) {
    return function (s) {
        Object.assign(s.schema.methods, methods)
    }
}

rts.withMixins = function (...mixins) {
    return function (s) {
        s.schema.mixins = s.schema.mixins.concat(mixins)
    }
}

module.exports = rts
