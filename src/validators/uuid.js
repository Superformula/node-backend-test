import uuidValidate from 'uuid-validate';
import Validator from '@/validators/validator';

export default class UuidValidator extends Validator {
	/**
	 * Register this validator or validator extension
	 */
	register() {
		/**
		 * Make sure the input is a valid UUID.
		 * If a number option is passed, it will validate the UUID for that version.
		 * For example:
		 * id: {
		 * 	uuid: 4
		 * }
		 *
		 * @param {*} value
		 * @param {*} [options]
		 * @returns {*}
		 */
		this._validate.validators.uuid = (value, options) => {
			if (!this._validate.isDefined(value)) {
				return;
			}
			const isValid = (+options && (options === 1 || options === 4)) ? uuidValidate(value, options) : uuidValidate(value);
			return !isValid ? 'is not a valid uuid' : null;
		};
	}
}
