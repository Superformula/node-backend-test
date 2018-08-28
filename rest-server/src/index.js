import http from 'http';

import App from './config/express';
import { success } from './lib/log';
import './config/database';

const app = App.express;

const server = http.createServer(app);
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(PORT, err => {
  if (err) throw new Error;
  success(`Successfully connected to PORT: ${PORT}`);
});

server.on('error', () => {
  server.close(
    setTimeout(server.listen((PORT, () => success('Successfully rebooted server'))), 1000)
  );
});

module.exports = server; // for testing purposes