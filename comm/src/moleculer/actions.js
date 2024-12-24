
let rts = {}
let actions = {}

rts.withAction = function (action) {
    actions = {...actions, ...action}
}

rts.getActions = function () {
    return actions
}

module.exports = rts
