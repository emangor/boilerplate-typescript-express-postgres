// src/app.ts
import config = require('./config');
import * as express from 'express';
import * as  cluster from 'cluster';
import * as bodyParser from 'body-parser';
import logger = require('./utils/logger');
//import controllers
import * as healthcheckController from './controllers/controller-healthcheck';
import * as sampleController from './controllers/controller-sample';
import { cpus } from 'os';
const numCPUs = cpus().length;

if (cluster.isMaster) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`);
        cluster.fork();
    });    
} else {
    //create express app
    const app: express.Express = express();
    const router: express.Router = express.Router();

    app.use(bodyParser.json());
    app.use(router);  // tell the app this is the router we are using

    //healthcheck routes
    router.get('/', healthcheckController.healthcheck);
    router.get('/healthcheck', healthcheckController.healthcheck);
    // sampleController routes
    router.get('/servertime', sampleController.getTime);
    router.get('/transaction', sampleController.sampleTransaction);

    app.listen(config.port, function () {
        logger.info(`worker started: ${cluster.worker.id} | server listening on port: ${config.port}`);
    });
}
