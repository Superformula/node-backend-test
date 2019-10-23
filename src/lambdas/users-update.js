import ExceptionHandler from '@/exceptions/handler';
import moment from 'moment';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');
const Lambda = require('aws-sdk/clients/lambda');

/**
 * @api {patch} /users/:id Update User
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiSampleRequest off
 *
 * @apiParam {String} id User's unique identifier.
 *
 * @apiParam (Body) {String} [name] User's name.
 * @apiParam (Body) {String} [dob] User's date of birth.
 * @apiParam (Body) {Object} [address] User's address.
 * @apiParam (Body) {String} [description] Description of the User.
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
 * 	"description": "Just your average dude."
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
 * HTTP/1.1 200 OK
 * {
 * 	"data":
 * 		"id": "000df75e-53e3-4afd-9362-b8b6b8afba90",
 * 		"name": "John Smith",
 * 		"dob": "1977-08-12",
 * 		"address": {
 * 			"street": "8276 Proctor Street",
 * 			"city": "Stockbridge",
 * 			"state": "GA",
 * 			"zip": "30281"
 * 		},
 * 		"description": "Just your average dude.",
 * 		"createdAt": "2019-10-19T15:22:18.210Z",
 * 		"updatedAt": "2019-10-20T17:39:41.380Z"
 * 	}
 * }
 *
 * @apiUse ResourceNotFoundException
 * @apiUse InvalidAttributeException
 * @apiUse Exception
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		let user = new User();
		user.id = event.params.path.id;

		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		user = await mapper.get(user).catch(err => {
			throw (err.name && err.name === 'ItemNotFoundException') ? new ResourceNotFoundException('User', user.id) : err;
		});

		let updated = new User(event.body);
		updated.id = user.id;
		updated.createdAt = moment(user.createdAt).utc().toISOString();
		updated.updatedAt = moment.utc().toISOString();

		await updated.validate();
		await updated.address.validate();

		updated = await mapper.update(updated);

		// Clear the CloudFront cache
		const lambda = new Lambda();
		const params = {
			FunctionName: `${process.env.STACK_NAME}-CloudFrontCreateInvalidation`,
			InvokeArgs: JSON.stringify({
				paths: ['/api/v1/users', `/api/v1/users/${updated.id}`]
			})
		};
		await lambda.invokeAsync(params).promise();

		return updated;
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
