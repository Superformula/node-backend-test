import ExceptionHandler from '@/exceptions/handler';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');

/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} id User's unique identifier.
 *
 * @apiSuccess (Success) {String} id User's unique identifier.
 * @apiSuccess (Success) {String} name User's name.
 * @apiSuccess (Success) {String} dob ISO 8601 Date of User's date of birth.
 * @apiSuccess (Success) {Object} address User's address.
 * @apiSuccess (Success) {String} description Description of the User.
 * @apiSuccess (Success) {String} createdAt ISO 8601 Datetime in UTC of when the User was created.
 * @apiSuccess (Success) {String} updatedAt ISO 8601 Datetime in UTC of when the User was last updated.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 * 	"data": {
 * 		"id": "548cad96-8191-4396-97d7-d84a1f3bc060",
 * 		"name": "Jane Doe",
 * 		"dob": "1985-01-15",
 * 		"address": {
 * 			"street": "12520 Boulder St",
 * 			"city": "Boulder Creek",
 * 			"state": "CA",
 * 			"zip": "95006"
 * 		},
 * 		"description": "One Cool Gal!",
 * 		"createdAt": "2019-10-18T02:23:31.467Z",
 * 		"updatedAt": "2019-10-20T17:39:41.380Z"
 * 	}
 * }
 *
 * @apiUse ResourceNotFoundException
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		const user = new User();
		user.id = event.params.path.id;

		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		return await mapper.get(user).catch(err => {
			throw (err.name && err.name === 'ItemNotFoundException') ? new ResourceNotFoundException('User', user.id) : err;
		});
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
