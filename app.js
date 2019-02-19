let express = require('express');
let User = require('./models/user');
let auth = require('./lib/auth');
let logger = require('./lib/logger');
let metrics = require('./lib/metrics');

let app = express();
let server = app.listen(8080);

app.use(express.json());

app.use((req, res) => {
	logger.log('router', 'incoming: ' + req.url);
});

app.get('/', (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_root');
	res.json({status: 'ok'});
	let duration = Date.now() - start;
	metrics.record('lat_index', duration);
});

// auth check
app.use((req, res) => {
	let start = Date.now();
	let token = req.headers.Authorization;
	let isAuthenticated = auth.authenticate(token);
	let duration = Date.now() - start;
	metrics.record('lat_auth', duration);
});

app.get('/v1/users', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_users');
	let resp = await User.all();
	if (resp instanceof Error) {
		res.status(500).end();
		return;
	}

	res.json(resp);
	let duration = Date.now() - start;
	metrics.record('lat_get_users', duration);
});

app.get('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_get_user');
	let id = req.params.id;
	let user = await User.fetch(id);
	if (user instanceof Error) {
		res.status(500).end();
	}

	res.json(user);
	let duration = Date.now() - start;
	metrics.record('lat_get_user', duration);
});

app.post('/v1/users', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_post_user');
	let body = req.body;
	let user = new User(body);
	let validationErrors = User.validate(user);
	if (validationErrors) {
		res.state(400).json(validationErrors);
		return;
	}

	let inserted = await User.insert(user);
	if (inserted instanceof Error) {
		res.status(500).end();
		return;
	}

	res.json(inserted);
	let duration = Date.now() - start;
	metrics.record('lat_post_user', duration);
});

app.put('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_put_user');
	let id = req.params.id;
	let body = req.body;
	let user = new User(body);
	let validationErrors = User.validate(user);
	if (validationErrors) {
		res.state(400).json(validationErrors);
		return;
	}

	let inserted = await User.insert(user);
	if (inserted instanceof Error) {
		res.status(500).end();
		return;
	}

	res.json(inserted);
	let duration = Date.now() - start;
	metrics.record('lat_put_user', duration);
});

app.delete('/v1/users/:id', async (req, res) => {
	let start = Date.now();
	metrics.increment('req_delete_user');
	let id = req.params.id;
	let result = await User.delete(id);
	if (result instanceof Error) {
		res.status(500).end();
		return;
	}

	res.status(204).end();
	let duration = Date.now() - start;
	metrics.record('lat_delete_user', duration);
});


app.post('/exit', (req, res) => {
	server.close();
});
