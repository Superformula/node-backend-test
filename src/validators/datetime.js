import moment from 'moment';
import Validator from '@/validators/validator';

export default class DatetimeValidator extends Validator {
	/**
	 * Register this validator or validator extension
	 */
	register() {
		this._validate.extend(this._validate.validators.datetime, {
			parse(value) {
				const date = new Date(value);
				return (date instanceof Date && !isNaN(date)) ? +moment.utc(value) : value;
			},
			format(value, options) {
				return options.dateOnly ? moment.utc(value).format('YYYY-MM-DD') : moment.utc(value).toISOString();
			}
		});
	}
}
