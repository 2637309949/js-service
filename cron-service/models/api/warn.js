const micro = require('comm/micro')
const {
    withCron
} = micro

// http://localhost:3000/api/cron/warn
withCron({
    name: 'warn',
    env: 'test',
    cronTime: '*/15 * * * * *',
    manualStart: false,
    onTick: async function (ctx) {
        this.logger.info("warn is onTick", ctx?.params)
    },
    onInitialize: function () {
        this.logger.info("warn is init")
    },
    onComplete: function () {
        this.logger.info("warn is stopped")
    }
})
