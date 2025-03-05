const { Errors } = require('moleculer')
const ApiGateway = require("moleculer-web")
const { UnAuthorizedError } = ApiGateway.Errors

// 应用错误
class ApplicationServerError extends Errors.MoleculerServerError {
    constructor(message, code, type, data) {
		super(message, code, type, data);
	}
}

// 数据库
class DatabaseServerError extends ApplicationServerError {
    constructor(message, data) {
		super(message, 51000, 'DATA', data);
	}
}

// 常规业务
class BusinessServerError extends ApplicationServerError {
    constructor(message, code, data) {
		super(message, code || 61000, 'BUSINESS', data);
	}
}

// 常规业务
class ArithmeticServerError extends ApplicationServerError {
    constructor(message, code, data) {
		super(message, code || 71000, 'ARITHMETIC', data);
	}
}

Object.assign(module.exports, Errors)
module.exports.UnAuthorizedError = UnAuthorizedError
module.exports.DatabaseServerError = DatabaseServerError
module.exports.BusinessServerError = BusinessServerError
module.exports.ArithmeticServerError = ArithmeticServerError
