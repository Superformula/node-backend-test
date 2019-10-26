import Exception from '@/exceptions/exception';

/**
 * Format errors for API Gateway response
 */
export default class ExceptionHandler {
	/**
	 * ExceptionHandler constructor
	 * @param {Exception|array} [error]
	 * @param {object} [context]
	 */
	constructor(error, context) {
		let errors = Array.isArray(error) ? error : [error];
		errors = errors.filter(exception => exception instanceof Exception);
		this.errors = errors.length ? errors : [new Exception()];
	}

	toString() {
		return JSON.stringify(this.errors);
	}
}
