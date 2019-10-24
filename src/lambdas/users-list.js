import ExceptionHandler from '@/exceptions/handler';
import User from '@/models/user';
import {contains, equals, notEquals} from '@aws/dynamodb-expressions';
import {DataMapper} from '@aws/dynamodb-data-mapper';

const DyanamoDB = require('aws-sdk/clients/dynamodb');

/**
 * @api {get} /users List Users
 * @apiGroup Users
 *
 * @apiExample {curl} Example
 * curl -X GET -H 'x-api-key: API_KEY_HERE' {{API_URL}}/users?filter[name]=Jane
 *
 * @apiUse Headers
 *
 * @apiParam (Query) {string} [filter[name]] Filter the resulting users where `name` is equal to value.
 * An optional operator can also be used:
 * * `filter[name][eq]` - Filter the resulting users where `name` is equal to value.
 * * `filter[name][not-eq]` - Filter the resulting users where `name` is not equal to value.
 * * `filter[name][contains]` - Filter the resulting users where `name` contains value.
 * Other fields are able to be filtered in the same way:
 * ```
 * filter[dob][contains]=1990&filter[address.city][not-eq]=Los+Angeles
 * ```
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
		const regex = /^filter\[([^\];]+)]\[?([^\];]+)?]?$/;
		const filters = Object.keys(event.params.querystring)
			.filter(query => regex.test(query))
			.map(filter => {
				const match = filter.match(regex);
				const value = event.params.querystring[match[0]];

				let predicate;
				switch (match[2]) {
					case 'contains':
						predicate = contains(value);
						break;
					case 'not-eq':
						predicate = notEquals(value);
						break;
					default:
					case 'eq':
						predicate = equals(value);
						break;
				}

				return {
					...predicate,
					subject: match[1]
				};
			});

		const client = new DyanamoDB();
		const mapper = new DataMapper({client});

		const users = [];
		const params = {valueConstructor: User};
		if (filters.length) {
			params.filter = {
				type: 'And',
				conditions: filters
			};
		}
		for await (const user of mapper.scan(params)) {
			users.push(user);
		}

		return users;
	} catch (err) {
		console.log(err);
		callback(new ExceptionHandler(err));
	}
}
