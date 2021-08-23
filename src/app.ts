import { config } from './config';
import express from 'express';
import cluster from 'cluster';
import { logger } from './utils/logger';
import { cpus } from 'os';
//import controllers
import { healthcheck } from './controllers/controller-healthcheck';
import { getTime, sampleTransaction } from './controllers/controller-sample';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        logger.error(
            `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`
        );
        cluster.fork();
    });
} else {
    //create express app
    const app: express.Express = express();
    const router: express.Router = express.Router();

    app.use(express.json());
    app.use(router); // tell the app this is the router we are using

    //healthcheck routes
    router.get('/', healthcheck);
    router.get('/healthcheck', healthcheck);
    // sampleController routes
    router.get('/servertime', getTime);
    router.get('/transaction', sampleTransaction);

    app.listen(config.port, function () {
        const workerId =
            cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
        logger.info(
            `worker started: ${workerId} | server listening on port: ${config.port}`
        );
    });
}
