module.exports = {
	authenticate(token) {
		// I've been using okta recently...
		// make a call to the auth server and validate the token
		// and get back and perms to check against


		if (token === 'abc') {
			return {
				user: 'demo',
				role: 'admin'
			};
		}

		return null;
	}
};
