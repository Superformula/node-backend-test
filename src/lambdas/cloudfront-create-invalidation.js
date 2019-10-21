import moment from 'moment/moment';

const CloudFront = require('aws-sdk/clients/cloudfront');

export async function handler(event, context, callback) {
	console.log(event);

	try {
		const paths = event.paths || [];
		if (paths.length) {
			const cache = new CloudFront();
			const params = {
				DistributionId: process.env.DISTRIBUTION_ID,
				InvalidationBatch: {
					CallerReference: moment.utc().toISOString(),
					Paths: {
						Quantity: paths.length,
						Items: paths
					}
				}
			};
			return await cache.createInvalidation(params).promise();
		}
	} catch (err) {
		console.log(err);
		callback(err);
	}
}
