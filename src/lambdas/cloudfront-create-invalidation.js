const CloudFront = require('aws-sdk/clients/cloudfront');

/**
 * This Lambda function is used to invalidate the CloudFront cache.
 *
 * InvokeArgs:
 * paths - array of CloudFront distribution paths to invalidate.
 *
 * Expected env variables:
 * DISTRIBUTION_ID - the target CloudFront distribution's id.
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise}
 */
export async function handler(event, context, callback) {
	console.log(event);

	try {
		const paths = event.paths || [];
		if (paths.length) {
			const cache = new CloudFront();
			const params = {
				DistributionId: process.env.DISTRIBUTION_ID,
				InvalidationBatch: {
					CallerReference: `${new Date().getTime()}`,
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
