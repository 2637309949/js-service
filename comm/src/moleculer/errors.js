const { Errors } = require('moleculer')
const ApiGateway = require("moleculer-web")
const { UnAuthorizedError } = ApiGateway.Errors

// 应用错误
class ApplicationServerError extends Errors.MoleculerServerError {
	/**
	 * Creates an instance of ApplicationServerError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof ApplicationServerError
	 */
    constructor(message, code, type, data) {
		super(message, code, type, data);
	}
}

// 数据库
class DatabaseServerError extends ApplicationServerError {
	/**
	 * Creates an instance of DatabaseServerError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof DatabaseServerError
	 */
    constructor(message, data) {
		super(message, 51000, 'DATA', data);
	}
}

// 常规业务
class BusinessServerError extends ApplicationServerError {
	/**
	 * Creates an instance of BusinessServerError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof BusinessServerError
	 */
    constructor(message, code, data) {
		super(message, code || 61000, 'BUSINESS', data);
	}
}

// 常规业务
class ArithmeticServerError extends ApplicationServerError {
	/**
	 * Creates an instance of BusinessServerError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof BusinessServerError
	 */
    constructor(message, code, data) {
		super(message, code || 71000, 'ARITHMETIC', data);
	}
}


module.exports = {
    ...Errors,
	UnAuthorizedError,
    DatabaseServerError,
    BusinessServerError,
    ArithmeticServerError
}
