import http from 'http';

import App from './config/express';

const app = App.express;

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, err => {
  if (err) throw new Error;
  console.log(`Successfully connected to PORT: ${PORT}`);
});

server.on('error', () => {
  server.close(
    setTimeout(server.listen((PORT, () => console.log('Successfully rebooted server'))), 1000)
  );
});

module.exports = server; // for testing purposes