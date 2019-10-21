const cfnResponse = require('cfn-response');
const S3 = require('aws-sdk/clients/s3');

/**
 * Deploy Api Documentation to the CloudFront Origin's S3 Bucket
 *
 * @param {object} event
 * @param {object} context
 * @param {function} callback
 */
export async function handler(event, context, callback) {
	console.log(event);

	if (event.RequestType === 'Delete') {
		await response(event, context, cfnResponse.SUCCESS);
	} else {
		const s3 = new S3();
		const apiUrl = event.ResourceProperties.ApiUrl;
		const destinationBucket = event.ResourceProperties.DestinationBucket;
		const sourceBucket = event.ResourceProperties.SourceBucket;
		const rewriteFiles = event.ResourceProperties.RewriteFiles || [];

		try {
			// Copy files to destination bucket
			const params = {
				Bucket: sourceBucket,
				Prefix: 'docs'
			};
			await s3.listObjects(params).promise().then(response => {
				return Promise.all(response.Contents.map(object => {
					const params = {
						Bucket: destinationBucket,
						CopySource: `${sourceBucket}/${object.Key}`,
						Key: object.Key.replace('docs/', '')
					};
					return s3.copyObject(params).promise();
				}));
			}).catch(err => {
				throw err;
			});

			// Rewrite API url in configuration files on destination bucket
			await Promise.all(rewriteFiles.map(key => {
				const params = {
					Bucket: destinationBucket,
					Key: key
				};

				return s3.getObject(params).promise().then(object => {
					const body = object.Body.toString().replace(new RegExp('{{API_URL}}', 'g'), apiUrl);
					const params = {
						Body: Buffer.from(body),
						Bucket: destinationBucket,
						Key: key
					};
					return s3.putObject(params).promise();
				});
			})).catch(err => {
				throw err;
			});

			await response(event, context, cfnResponse.SUCCESS);
		} catch (err) {
			console.log(err);
			await response(event, context, cfnResponse.FAILED, err);
		}
	}
}

async function response(event, context, status, err) {
	return new Promise(() => {
		err = err ? {error: err} : {};
		cfnResponse.send(event, context, status, err, event.LogicalResourceId);
	});
}
