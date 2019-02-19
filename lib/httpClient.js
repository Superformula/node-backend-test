class HttpClient {
	constructor(host, port) {
		this.host = host;
		this.port = port;
		this.isHTTPS = port === 443;
	}

	request(method, path, body, headers = {}) {
		return new Promise((resolve) => {
			if (!headers['Content-Type']) {
				headers['Content-Type'] = 'application/json';
			}

			let hostname = this.host;
			let port = this.port;

			let opts = {
				method,
				hostname,
				port,
				path,
				headers
			};

			let lib = this.isHTTPS ? require('https') : require('http');
			let req = lib.request(opts, res => {
				let chunks = [];
				res.on('error', err => resolve(err));
				res.on('data', (c) => chunks.push(c));
				res.on('end', () => {
					resolve({
						headers: res.headers,
						statusCode: res.statusCode,
						body: Buffer.concat(chunks).toString(),
					});
				});
			});

			if (body && typeof body === 'object') {
				req.write(JSON.stringify(body));
			}
			if (body && typeof body !== 'object') {
				req.write(body);
			}

			req.end();
		});
	}
}

module.exports = HttpClient;
