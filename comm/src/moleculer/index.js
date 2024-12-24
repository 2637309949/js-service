require('dotenv').config()
const { ServiceBroker } = require('moleculer')
const mixins = require('./mixins')
const actions = require('./actions')
const methods = require('./methods')
const errors = require('./errors')
const path = require('path')
const chalk = require('chalk')
const _ = require("lodash")

let rts = {
    ...actions,
    ...methods,
    errors
}
rts.createService = function (...opts) {
    let c = {
        broker: {
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
        consul: {
            port: 8500,
            host: "172.30.12.14"
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
            }
        }
    }

    for (let i = 0; i < opts.length; i++) {
        let opt = opts[i]
        opt(c)
    }

    // redefined folder
    const [, file] = c.broker.logger
    file.options.folder = path.join(file.options.folder, c.schema.name)
    // global c
    c.schema.settings.c = c
    const broker = new ServiceBroker(c.broker)
    broker.createService(c.schema)
    return broker
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

module.exports = rts
