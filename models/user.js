let uuid = require('uuid/v4');

/**
 * @class User
 * @property {string} id
 * @property {string} name
 * @property {string} dob
 * @property {string} address
 * @property {string} description
 * @property {string} createdAt
 * @property {string} updatedAt
 */
class User {
	/**
	 * @param {User|string|object} [o]
	 */
	constructor(o) {
		this.id = uuid();
		this.name = undefined;
		this.dob = undefined;
		this.address = undefined;
		this.description = undefined;
		this.createdAt = undefined;
		this.updatedAt = undefined;

		if (!o) return;
		if (typeof o === 'string') {
			o = JSON.parse(o);
		}
		for (let k of Object.keys(this)) {
			if (k in o && typeof o[k] !== 'undefined') {
				this[k] = JSON.parse(JSON.stringify(o[k]));
			}
		}
	}

	/**
	 * @param {User} user
	 */
	static validate(user) {
		let errors = [];
		let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		let iso8601Pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?Z$/;
		let lowerBound = new Date(1900, 0, 1).toISOString();

		if (!user.id) {
			errors.push('missing id');
		}
		if (!uuidPattern.test(user.id)) {
			errors.push('invalid id');
		}
		if (!user.name) {
			errors.push('missing name');
		}
		if (!user.dob) {
			errors.push('missing dob');
		}
		if (!iso8601Pattern.test(user.dob)) {
			errors.push('invalid dob date format');
		}
		if (!user.dob.includes('Z')) {
			errors.push('invalid timezone for dob');
		}
		if (user.dob <= lowerBound) {
			errors.push('dob earlier than lower bound');
		}
		if (!user.address) {
			errors.push('missing address');
		}
		if (!user.description) {
			errors.push('missing user description');
		}

		return errors.length ? errors : null;
	}
}

module.exports = User;
