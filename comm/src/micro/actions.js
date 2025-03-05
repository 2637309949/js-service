
let actions = {}

function withAction(action) {
    Object.assign(actions, action)
}

function getActions() {
    return actions
}

module.exports.withAction = withAction
module.exports.getActions = getActions
