const _ = require("lodash")
const { ServiceBroker, Middlewares, Errors: {
    ValidationError,
    MoleculerError
} } = require('moleculer')
const ApiService = require("moleculer-web")
const CronMixin = require("moleculer-cron")
const consul = require('./consul')
const mixins = require('./mixins')
const actions = require('./actions')
const methods = require('./methods')
const crons = require('./crons')
const errors = require('./errors')
const middlewares = require('./middlewares')
const util = require('../util')
const path = require('path')
const chalk = require('chalk')

// override HotReload
Middlewares.HotReload = middlewares.HotReloadMiddleware

let lut = []
let broker = null

for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? "0" : "") + i.toString(16)
}

function uidGenerator() {
    const d0 = (Math.random() * 0xffffffff) | 0;
    const d1 = (Math.random() * 0xffffffff) | 0;
    const d2 = (Math.random() * 0xffffffff) | 0;
    const d3 = (Math.random() * 0xffffffff) | 0;
    let uid = (
        lut[d0 & 0xff] +
        lut[(d0 >> 8) & 0xff] +
        lut[(d0 >> 16) & 0xff] +
        lut[(d0 >> 24) & 0xff] +
        "-" +
        lut[d1 & 0xff] +
        lut[(d1 >> 8) & 0xff] +
        "-" +
        lut[((d1 >> 16) & 0x0f) | 0x40] +
        lut[(d1 >> 24) & 0xff] +
        "-" +
        lut[(d2 & 0x3f) | 0x80] +
        lut[(d2 >> 8) & 0xff] +
        "-" +
        lut[(d2 >> 16) & 0xff] +
        lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] +
        lut[(d3 >> 8) & 0xff] +
        lut[(d3 >> 16) & 0xff] +
        lut[(d3 >> 24) & 0xff]
    )
    uid = uid.replace(/-/g, "").substring(0, 16)
    return uid
}

function consoleFormatter(level, args, bindings, { printArgs }) {
    const date = new Date
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    // gray traceId
    const lastArg = args[args.length - 1]
    if (typeof lastArg === 'string' && lastArg.length === 16) {
        args[args.length - 1] = chalk.gray(lastArg)
    }

    // chalk join
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

function fileFormatter(level, args, bindings, { printArgs }) {
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

let rts = {
    ...actions,
    ...methods,
    ...crons,
    errors
}

rts.createService = async function (...opts) {
    const ccf = await consul.CommConf()
    let c = {}
    const namespace = ccf.env
    const hotReload = ccf.env === 'dev' || ccf.env === 'test'
    const logLevel = 'info'
    c.broker = {
        namespace,
        hotReload,
        logLevel,
        cacher: 'Memory',
        logger: [
            {
                type: "Console",
                options: {
                    level: "info",
                    formatter: consoleFormatter
                }
            },
            {
                type: "File",
                options: {
                    level: "info",
                    folder: "C:\\Users\/Doubl\/Desktop\/logs",
                    filename: "{date}.log",
                    formatter: fileFormatter
                }
            },
        ],
        tracing: true,
        tracking: {// graceful service shutdowns
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
        },
        uidGenerator,
        middlewares: [{
            localAction(next, action) {
                return function (ctx) {
                    const logger = broker.logger
                    logger.info(`========== ${action.name} invoked ==========`, ctx.requestID)
                    return next(ctx)
                        .then(res => {
                            return res
                        })
                        .catch(err => {
                            if (err instanceof MoleculerError) { // just print message
                                logger.error(`${err.code},${err.message}`, ctx.requestID)
                            } else {// throw stack
                                logger.error(err, ctx.requestID)
                            }
                            throw err
                        })
                }
            }
        }]
    }
    c.schema = {
        name: 'N/A',
        mixins: [],
        settings: {
            cronJobs: [],
        },
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
            },
            fatal(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.fatal(...args)
            },
            error(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.error(...args)
            },
            warn(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.warn(...args)
            },
            info(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.info(...args)
            },
            debug(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.debug(...args)
            },
            trace(ctx, ...args) {
                const logger = this.withLogger(ctx)
                logger.trace(...args)
            },
            check(ctx, ...props) {
                const rsp = []
                const obj = ctx.params
                props.forEach(prop => {
                    if (!obj[prop]) {
                        rsp.push(prop)
                    }
                })
                if (rsp.length) {
                    throw new ValidationError(`参数[${rsp.join(',')}]不能为空!`)
                }
            }
        },
        actions: {}
    }

    opts.push(rts.withMixins(mixins.consul))
    opts.push(rts.withMixins(mixins.sequelize))
    opts.push(rts.withMixins(...mixins.getMixins()))
    opts.push(rts.withActions(actions.getActions()))
    opts.push(rts.withMethods(methods.getMethods()))
    opts.push(rts.withCrons(...crons.getCrons()))
   
    for (let i = 0; i < opts.length; i++) {
        let opt = opts[i]
        if (util.isPromise(opt)) {
            await opt(c)
        } else {
            opt(c)
        }
    }

    // redefined folder
    const [, file] = c.broker.logger
    file.options.folder = path.join(file.options.folder, c.schema.name)
    
    // global c
    c.schema.settings.c = c
    
    broker = new ServiceBroker(c.broker)
    broker.createService(c.schema)
    broker.start().catch(err => broker.logger.error(err))
    return broker
}

rts.createWeb = function (...opts) {
    return rts.createService(rts.withMixins(ApiService), ...opts)
}

rts.createCron = function (...opts) {
    return rts.createService(rts.withMixins(CronMixin), ...opts)
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

rts.withCrons = function (...crons) {
    return async function (s) {
        const ccf = await consul.CommConf()
        crons.forEach(cron => {
            if (util.isString(cron.env) && cron.env !== ccf.env) {
                return
            }
            if (Array.isArray(cron.env) && !cron.env.includes(ccf.env)) {
                return
            }
            s.schema.settings.cronJobs.push(cron)
            s.schema.actions[cron.name] = cron.onTick
        })
    }
}

rts.withMixin = mixins.withMixin
rts.withMixins = function (...mixins) {
    return function (s) {
        s.schema.mixins = s.schema.mixins.concat(mixins)
    }
}

rts.withSettings = function (setting) {
    return function (s) {
        Object.assign(s.schema.settings, setting)
    }
}

module.exports = rts
