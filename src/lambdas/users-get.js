import ExceptionHandler from '@/exceptions/handler';
import ResourceNotFoundException from '@/exceptions/resource-not-found-exception';
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
 * @apiSuccess {String} id User's unique identifier.
 * @apiSuccess {String} name User's name.
 * @apiSuccess {String} dob User's date of birth.
 * @apiSuccess {Object} address User's address.
 * @apiSuccess {String} description Description of the User.
 * @apiSuccess {Number} createdAt Timestamp of when the User was created.
 * @apiSuccess {Number} updatedAt Timestamp of when the User was last updated.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 * 	"id": "548cad96-8191-4396-97d7-d84a1f3bc060",
 * 	"name": "Jane Doe",
 * 	"dob": "1985-01-15",
 * 	"address": {
 * 		"street": "12520 Boulder St",
 * 		"city": "Boulder Creek",
 * 		"state": "CA",
 * 		"zip": "95006"
 * 	},
 * 	"description": "One Cool Gal!",
 * 	"createdAt": 1571363778,
 * 	"updatedAt": 1571548812
 * }
 *
 * @apiUse ResourceNotFoundException
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		const user = new User(event.params.path);

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
