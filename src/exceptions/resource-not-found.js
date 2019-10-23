import Exception from '@/exceptions/exception';

/**
 * @apiDefine ResourceNotFoundException
 *
 * @apiError (Error) ResourceNotFound The resource with that id does not exist.
 *
 * @apiErrorExample ResourceNotFound
 * HTTP/1.1 404 Not Found
 * {
 * 	"errors": [
 * 		{
 * 			"status": 404,
 * 			"title": "ResourceNotFound",
 * 			"detail": "User with id 'b1343cf8-72c2-4e37-8d96-c48c3aa796d7' does not exist."
 * 		}
 * 	]
 * }
 */
export default class ResourceNotFoundException extends Exception {
	/**
	 * ResourceNotFoundException constructor
	 * @param {string} [resource]
	 * @param {string|number} [id]
	 */
	constructor(resource, id) {
		super(`${resource || 'Resource'} with id '${id || 'unknown'}' does not exist.`);

		this.status = 404;
		this.title = 'ResourceNotFound';
	}
}
