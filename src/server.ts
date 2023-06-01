import express from 'express'
import mongoose from 'mongoose'
import { config } from './config/config'
import http from 'http';
import { ROUTER } from './routes';
import { verifyToken } from './middleware/verify-token';

const app = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

const serverConfig = () => {
  console.log('Server configuration started')
  app.use((req, res, next) => {
    console.log(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`);
    res.on('finish', () => {
      console.log(`Outgoing -> Status: [${res.statusCode}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Method: [${req.method}]`);
    })
    next();
  });
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    }
    next();
  })
  app.use(verifyToken)

  app.use('/ping', (req, res) => {
    return res.status(200).json({ message: 'pong' });
  });
  
  for(const route of ROUTER) {
    console.log(`Loading route ${route.path}`);
    app.use(`/api/v1${route.path}`, route.router);
  }
  
  app.use((req, res) => {
    console.log(req.body)
    const error = new Error('Not found');
    return res.status(404).json({ message: error.message });
  })

  http.createServer(app).listen(config.server.port, () => console.log(`Express is listening at http://localhost:${config.server.port}`));
}

serverConfig();