/**
 * @apiDefine Exception
 *
 * @apiError (Error) InternalServiceError An unknown error occurred.
 *
 * @apiErrorExample InternalServiceError
 * HTTP/1.1 500 Internal Service Error
 * {
 * 	"errors": [
 * 		{
 * 			"status": 500,
 * 			"title": "InternalServiceError",
 * 			"detail": "An unknown error occurred."
 * 		}
 * 	]
 * }
 */
export default class Exception {
	/**
	 * Exception constructor
	 * @param {string} [detail]
	 */
	constructor(detail) {
		this.status = 500;
		this.title = 'InternalServiceError';
		this.detail = detail || 'An unknown error occurred.';
	}
}
