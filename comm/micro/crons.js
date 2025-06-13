let crons = []

function withCron(cron) {
    crons.push(cron)
}

function getCrons() {
    return crons
}

module.exports.getCrons = getCrons
module.exports.withCron = withCron

