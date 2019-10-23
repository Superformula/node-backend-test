import ExceptionHandler from '@/exceptions/handler';
import ResourceNotFoundException from '@/exceptions/resource-not-found';
import User from '@/models/user';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');
const Lambda = require('aws-sdk/clients/lambda');

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiSampleRequest off
 *
 * @apiParam {String} id User's unique identifier.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 204 No Content
 *
 * @apiUse ResourceNotFoundException
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

		await mapper.delete(user);

		// Clear the CloudFront cache
		const lambda = new Lambda();
		const params = {
			FunctionName: `${process.env.STACK_NAME}-CloudFrontCreateInvalidation`,
			InvokeArgs: JSON.stringify({
				paths: ['/api/v1/users', `/api/v1/users/${user.id}`]
			})
		};
		await lambda.invokeAsync(params).promise();
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
