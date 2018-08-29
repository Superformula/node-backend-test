import express from 'express';
import parser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../swagger.json';

import router from '../../routes/index';

const middleWare = [
  helmet(),
  parser.json(),
  parser.urlencoded({ extended: true }),
  cors({
    allowedHeaders: 'Content-Type, authorization',
    methods: ['GET, POST, PUT, DELETE', 'OPTIONS'],
  }),
];

class App {
  constructor() {
    this.express = express();
    this.mountMiddleWare();
    this.serveSwagger();
    this.mountRoutes();
  }

  mountMiddleWare() {
    this.express.use(...middleWare);
  }

  mountRoutes() {
    this.express.use('/api', router);
  }

  serveSwagger() {
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default new App();