import ExceptionHandler from '@/exceptions/handler';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');

/**
 * @api {get} /users List Users
 * @apiName ListUsers
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 * 	"data": [
 * 		{
 * 			"id": "548cad96-8191-4396-97d7-d84a1f3bc060",
 * 			"name": "Jane Doe",
 * 			"dob": "1985-01-15",
 * 			"address": {
 * 				"street": "12520 Boulder St",
 * 				"city": "Boulder Creek",
 * 				"state": "CA",
 * 				"zip": "95006"
 * 			},
 * 			"description": "One Cool Gal!",
 * 			"createdAt": "2019-10-18T02:23:31.467Z",
 * 			"updatedAt": "2019-10-20T17:39:41.380Z"
 * 		},
 * 		{
 * 			"id": "e34c2498-8b12-485a-9f3b-92342b561062",
 * 			"name": "Jennie Smith",
 * 			"dob": "1990-05-08",
 * 			"address": {
 * 				"street": "939 Elmwood Street",
 * 				"city": "Moncks Corner",
 * 				"state": "SC",
 * 				"zip": "29461"
 * 			},
 * 			"description": "She's like the best.",
 * 			"createdAt": "2019-10-21T02:23:31.467Z",
 * 			"updatedAt": "2019-10-21T02:23:31.467Z"
 * 		}
 * 	]
 * }
 *
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		const users = [];
		for await (const user of mapper.scan({valueConstructor: User})) {
			users.push(user);
		}

		return users;
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
