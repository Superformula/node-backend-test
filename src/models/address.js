import Model from '@/models/model';
import {DynamoDbSchema} from '@aws/dynamodb-data-mapper';

export default class Address extends Model {
	/**
	 * This Model's attributes including type and validation
	 *
	 * @returns {object}
	 */
	attributes() {
		return {
			street: {
				presence: false,
				type: 'string'
			},
			city: {
				presence: false,
				type: 'string'
			},
			state: {
				presence: false,
				type: 'string'
			},
			zip: {
				presence: false,
				type: 'string'
			}
		};
	}
}

/**
 * DynamoDB Schema configuration
 * See: https://github.com/awslabs/dynamodb-data-mapper-js/tree/master/packages/dynamodb-data-mapper
 */
Object.defineProperty(Address.prototype, DynamoDbSchema, {
	value: {
		street: {
			type: 'String'
		},
		city: {
			type: 'String'
		},
		state: {
			type: 'String'
		},
		zip: {
			type: 'String'
		}
	}
});
