import env from './src/utils/env';
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import errorHandler from './src/middlewares/errorHandler';
import pathHandler from './src/middlewares/pathHandler';
import IndexRouter from './src/routers/index';

const server = express();
const PORT = env.PORT || 8080;
const ready = () => console.log(`server ready on port ${PORT}`);
const httpServer = createServer(server);
httpServer.listen(PORT, ready);

//middlewares
server.use(cookieParser(env.SECRET_KEY));
server.use(
  cors({
    origin: true,
    credentials: true,
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(morgan('dev'));

//endpoints
const { router } = new IndexRouter();
server.use('/', router);
server.use(errorHandler);
server.use(pathHandler);
