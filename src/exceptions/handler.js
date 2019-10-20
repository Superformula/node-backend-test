import Exception from '@/exceptions/exception';

export default class ExceptionHandler {
	/**
	 * ExceptionHandler constructor
	 * @param {Exception|array} [error]
	 * @param {object} [context]
	 */
	constructor(error, context) {
		error = Array.isArray(error) ? error : [error];
		this.errors = error.filter(exception => exception instanceof Exception);
	}

	toString() {
		if (!this.errors.length) {
			this.errors.push(new Exception());
		}
		return JSON.stringify(this.errors);
	}
}
