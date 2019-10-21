import Exception from '@/exceptions/exception';

/**
 * @apiDefine InvalidAttributeException
 *
 * @apiError (Error) InvalidAttribute An invalid attribute was used.
 *
 * @apiErrorExample InvalidAttribute
 * HTTP/1.1 422 Unprocessable Entity
 * {
 * 	"errors": [
 * 		{
 * 			"status": 422,
 * 			"title": "InvalidAttribute",
 * 			"detail": "Name can't be blank"
 * 		}
 * 	]
 * }
 */
export default class InvalidAttributeException extends Exception {
	/**
	 * InvalidAttribute constructor
	 * @param {string} detail
	 */
	constructor(detail) {
		super(detail);

		this.status = 422;
		this.title = 'InvalidAttribute';
	}
}
