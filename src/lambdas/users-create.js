import ExceptionHandler from '@/exceptions/handler';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');
const Lambda = require('aws-sdk/clients/lambda');

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiSampleRequest off
 *
 * @apiParam (Body) {String} name User's name.
 * @apiParam (Body) {String} [dob] User's date of birth.
 * @apiParam (Body) {Object} [address] User's address.
 * @apiParam (Body) {String} [description] Description of the User.
 *
 * @apiParamExample {json} Request-Example
 * {
 * 	"name": "Jennie Smith",
 * 	"dob": "1990-05-08",
 * 	"address": {
 * 		"street": "1990-05-08",
 * 		"city": "Moncks Corner",
 * 		"state": "SC",
 * 		"zip": "29461"
 * 	},
 * 	"description": "She's like the best."
 * }
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
 * HTTP/1.1 201 Created
 * {
 * 	"data":
 * 		"id": "e34c2498-8b12-485a-9f3b-92342b561062",
 * 		"name": "Jennie Smith",
 * 		"dob": "1990-05-08",
 * 		"address": {
 * 			"street": "939 Elmwood Street",
 * 			"city": "Moncks Corner",
 * 			"state": "SC",
 * 			"zip": "29461"
 * 		},
 * 		"description": "She's like the best.",
 * 		"createdAt": "2019-10-21T02:23:31.467Z",
 * 		"updatedAt": "2019-10-21T02:23:31.467Z"
 * 	}
 * }
 *
 * @apiUse InvalidAttributeException
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		let user = new User(event.body);
		await user.validate();
		await user.address.validate();

		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		user = await mapper.put(user);

		// Clear the CloudFront cache
		const lambda = new Lambda();
		const params = {
			FunctionName: `${process.env.STACK_NAME}-CloudFrontCreateInvalidation`,
			InvokeArgs: JSON.stringify({
				paths: ['/api/v1/users']
			})
		};
		await lambda.invokeAsync(params).promise();

		return user;
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
