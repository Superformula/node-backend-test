import ExceptionHandler from '@/exceptions/handler';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} name User's name.
 * @apiParam {String} [dob] User's date of birth.
 * @apiParam {Object} [address] User's address.
 * @apiParam {String} [description] Description of the User.
 *
 * @apiParamExample {json} Request-Example
 * {
 * 	"name": "John Smith",
 * 	"dob": "1977-08-12",
 * 	"address": {
 * 		"street": "8276 Proctor Street",
 * 		"city": "Stockbridge",
 * 		"state": "GA",
 * 		"zip": "30281"
 * 	},
 * 	"description": "Just your average dude.",
 * }
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
 * 	"id": "000df75e-53e3-4afd-9362-b8b6b8afba90",
 * 	"name": "John Smith",
 * 	"dob": "1977-08-12",
 * 	"address": {
 * 		"street": "8276 Proctor Street",
 * 		"city": "Stockbridge",
 * 		"state": "GA",
 * 		"zip": "30281"
 * 	},
 * 	"description": "Just your average dude.",
 * 	"createdAt": 1571363778,
 * 	"updatedAt": 1571363778
 * }
 *
 * @apiUse InvalidAttributeException
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		const user = new User(event.body);
		await user.validate();

		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		await mapper.put(user);
		return user;
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
