import express from 'express';
import parser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

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
  }

  mountMiddleWare() {
    this.express.use(...middleWare);
  }
}

export default new App();