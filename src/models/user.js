import Address from '@/models/address';
import DatetimeValidator from '@/validators/datetime';
import Model from '@/models/model';
import moment from 'moment';
import uuid from 'uuid';
import UuidValidator from '@/validators/uuid';
import {DynamoDbSchema, DynamoDbTable, embed} from '@aws/dynamodb-data-mapper';

export default class User extends Model {
	/**
	 * This Model's attributes including type and validation
	 *
	 * @returns {object}
	 */
	attributes() {
		return {
			id: {
				presence: true,
				type: 'string',
				uuid: 4,
				defaultValue() {
					return uuid.v4();
				},
				userInput: false
			},
			name: {
				presence: true,
				type: 'string'
			},
			dob: {
				presence: false,
				date: {
					latest: moment.utc()
				}
			},
			address: {
				presence: false,
				type: {
					type(value) {
						return value instanceof Address;
					}
				},
				defaultValue: new Address(),
				transform(data) {
					return new Address(data);
				}
			},
			description: {
				presence: false,
				type: 'string'
			},
			createdAt: {
				presence: true,
				datetime: true,
				defaultValue: moment.utc().toISOString(),
				userInput: false
			},
			updatedAt: {
				presence: true,
				datetime: true,
				defaultValue: moment.utc().toISOString(),
				userInput: false
			}
		};
	}

	/**
	 * This Model's custom validators
	 *
	 * @param {validate} validate The validate.js instance
	 * @returns {Array}
	 */
	validators(validate) {
		return [
			new DatetimeValidator(validate),
			new UuidValidator(validate)
		];
	}
}

/**
 * DynamoDB Schema configuration
 * See: https://github.com/awslabs/dynamodb-data-mapper-js/tree/master/packages/dynamodb-data-mapper
 */
Object.defineProperties(User.prototype, {
	[DynamoDbTable]: {
		value: `${process.env.STACK_NAME}-Users`
	},
	[DynamoDbSchema]: {
		value: {
			id: {
				type: 'String',
				keyType: 'HASH',
				defaultProvider: uuid.v4
			},
			name: {
				type: 'String'
			},
			dob: {
				type: 'String'
			},
			address: embed(Address),
			description: {
				type: 'String'
			},
			createdAt: {
				type: 'Date'
			},
			updatedAt: {
				type: 'Date'
			}
		}
	}
});
