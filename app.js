let express = require('express');
let User = require('./models/user');
let models = require('./models/index');

let auth = require('./lib/auth');
let logger = require('./lib/logger');
let metrics = require('./lib/metrics');

let app = express();
let server = app.listen(8080, () => console.log('...'));

if (process.env.LOCAL) {
	models.initForLocal();
	models.dataReset();
}

app.use(express.json());

// access log
app.use((req, res, next) => {
	logger.log('router', 'incoming: ' + req.url);
	next();
});

// convenience for testing
app.post('/exit', (req, res) => {
	res.end();
	if (models.local) {
		server.close();
	}
});

// root
app.get('/', (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_root');
	res.json({status: 'ok'});
	let duration = Date.now() - start;
	metrics.record('lat_index', duration);
});

// auth
app.use((req, res, next) => {
	let start = Date.now();
	metrics.increment('auth');
	let accessToken = req.headers.authorization;
	let isAuthenticated = auth.authenticate(accessToken);
	if (!isAuthenticated) {
		metrics.increment('unauthorized');
		res.status(401).end();
		let duration = Date.now() - start;
		metrics.record('lat_auth_unauthorized', duration);
		return;
	}

	let duration = Date.now() - start;
	metrics.record('lat_auth_authorized', duration);
	next();
});

app.get('/v1/users', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_users');
	let resp = await User.getAll();
	if (resp instanceof Error) {
		res.status(500).end();
		metrics.increment('req_get_users_500');
		let duration = Date.now() - start;
		metrics.record('lat_get_users_500', duration);
		return;
	}

	res.json(resp);
	metrics.increment('req_get_users_200');
	let duration = Date.now() - start;
	metrics.record('lat_get_users_200', duration);
});

app.get('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_user');
	let id = req.params.id;
	let user = await User.fetch(id);
	if (user instanceof Error) {
		res.status(500).end();
		metrics.increment('req_get_user_500');
		let duration = Date.now() - start;
		metrics.record('lat_get_user_500', duration);
		return;
	}

	res.json(user);
	metrics.increment('req_get_user_200');
	let duration = Date.now() - start;
	metrics.record('lat_get_user_200', duration);
});

app.post('/v1/users', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_post_user');
	let body = req.body;
	let user = new User(body);
	let validationErrors = User.validate(user);
	if (validationErrors) {
		res.status(400).json(validationErrors);
		metrics.increment('req_post_user_400');
		let duration = Date.now() - start;
		metrics.record('lat_post_user_400', duration);
		return;
	}

	let inserted = await User.insert(user);
	if (inserted instanceof Error) {
		res.status(500).end();
		metrics.increment('req_post_user_500');
		let duration = Date.now() - start;
		metrics.record('lat_post_user_500', duration);
		return;
	}

	res.json(inserted);
	metrics.increment('req_post_user_200');
	let duration = Date.now() - start;
	metrics.record('lat_post_user_200', duration);
});

app.put('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_put_user');
	let id = req.params.id;
	let existing = await User.fetch(id);
	let isError = existing instanceof Error;
	if (isError &&
		existing.message.includes('does not exist')) {
		res.status(400).end();
		metrics.increment('req_put_user_400_nonexisting');
		let duration = Date.now() - start;
		metrics.record('lat_put_user_400_nonexisting', duration);
		return;
	}
	if (isError) {
		res.status(500).end();
		metrics.increment('req_put_user_500_fetch');
		let duration = Date.now() - start;
		metrics.record('lat_put_user_500_fetch', duration);
		return;
	}

	let body = req.body;
	let user = new User(body);
	let validationErrors = User.validate(user);
	if (validationErrors) {
		res.status(400).json(validationErrors);
		metrics.increment('req_put_user_400_invalid_data');
		let duration = Date.now() - start;
		metrics.record('lat_put_user_400_invalid_data', duration);
		return;
	}

	let inserted = await User.insert(user);
	if (inserted instanceof Error) {
		metrics.increment('req_put_user_500_insert');
		res.status(500).end();
		let duration = Date.now() - start;
		metrics.record('lat_put_user_500_insert', duration);
		return;
	}

	res.json(inserted);
	metrics.increment('req_put_user_200');
	let duration = Date.now() - start;
	metrics.record('lat_put_user_200', duration);
});

app.delete('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_delete_user');
	let id = req.params.id;
	let result = await User.delete(id);
	if (result instanceof Error) {
		res.status(500).end();
		let duration = Date.now() - start;
		metrics.increment('req_delete_user_500');
		metrics.record('lat_delete_user_500', duration);
		return;
	}

	res.status(204).end();
	metrics.increment('req_delete_user_200');
	let duration = Date.now() - start;
	metrics.record('lat_delete_user_200', duration);
});
