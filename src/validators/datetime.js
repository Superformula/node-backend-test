import moment from 'moment';
import Validator from '@/validators/validator';

export default class DatetimeValidator extends Validator {
	/**
	 * Register this validator or validator extension
	 */
	register() {
		this._validate.extend(this._validate.validators.datetime, {
			parse(value, options) {
				return +moment.utc(value);
			},
			format(value, options) {
				return options.dateOnly ? moment.utc(value).format('YYYY-MM-DD') : moment.utc(value).toISOString();
			}
		});
	}
}
