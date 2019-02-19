module.exports = {
	log(dispatcher, m) {
		console.log(Date.now(), dispatcher, m);

		// also can send it off to a log service
		// some combo of these other options too:
		// elastic with ttl
		// kinesis and pump it to s3
	}
};
