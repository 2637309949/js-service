
let rts = {}
let crons = []

rts.withCron = function (cron) {
    crons.push(cron)
}

rts.getCrons = function () {
    return crons
}

module.exports = rts
