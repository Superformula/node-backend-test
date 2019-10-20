import validate from 'validate.js';
import InvalidAttributeException from '@/exceptions/invalid-attribute';

export default class Model {
	/**
	 * Model constructor
	 * @param {object} [data]
	 */
	constructor(data) {
		this.populate(data || {});
	}

	/**
	 * Populate data onto this Model
	 *
	 * @param {object} data
	 */
	populate(data) {
		const attributes = this.attributes();
		Object.keys(attributes).forEach(key => {
			if (data.hasOwnProperty(key)) {
				if (typeof attributes[key].transform === 'function') {
					this[key] = attributes[key].transform(data[key]);
				} else {
					this[key] = data[key];
				}
			}
			if (!this[key]) {
				if (typeof attributes[key].defaultValue === 'function') {
					this[key] = attributes[key].defaultValue();
				} else {
					this[key] = attributes[key].defaultValue || undefined;
				}
			}
		});
	}

	/**
	 * Validate the current properties of this Model
	 *
	 * @returns {Promise}
	 */
	validate() {
		this.validators(validate).forEach(validator => {
			validator.register();
		});

		const properties = {};
		const constraints = {};
		const attributes = this.attributes();
		Object.keys(attributes).forEach(key => {
			properties[key] = this.hasOwnProperty(key) ? this[key] : null;
		});
		Object.keys(attributes).forEach(key => {
			const constraint = attributes[key];
			if (constraint.hasOwnProperty('defaultValue')) {
				delete constraint.defaultValue;
			}
			if (constraint.hasOwnProperty('transform')) {
				delete constraint.transform;
			}
			constraints[key] = constraint;
		});

		return validate.async(properties, constraints).catch(error => {
			const messages = Object.values(error)[0];
			throw new InvalidAttributeException(Array.isArray(messages) ? messages[0] : messages);
		});
	}

	/**
	 * This Model's attributes including validation, default value, and input transformation.
	 * See https://validatejs.org for more validator configurations.
	 *
	 * Example:
	 * {
	 * 	id: {
	 * 		type: 'string',
	 * 		presence: true,
	 * 		defaultValue() {
	 * 			return Math.random();
	 * 		}
	 * 	},
	 * 	date: {
	 * 		presence: true,
	 * 		datetime: true,
	 * 		defaultValue: moment.utc().toISOString(),
	 * 		transform(value) {
	 * 			return moment.utc(value).toISOString();
	 * 		}
	 * 	},
	 * 	name: {
	 * 		type: 'string',
	 * 		presence: false
	 * 	},
	 * }
	 *
	 * @returns {object}
	 */
	attributes() {
		return {};
	}

	/**
	 * This Model's custom validators
	 * Example:
	 * return [
	 *    new DatetimeValidator(validate),
	 *    new UuidValidator(validate)
	 * ]
	 *
	 * @param {validate} validate The validate.js instance
	 * @returns {Array}
	 */
	validators(validate) {
		return [];
	}
}
