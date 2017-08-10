import * as pg from 'pg';
import * as async from 'async';
import config = require('./../config');
import logger = require('./../utils/logger');

const pgconfig = {
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    max: config.db.max,
    idleTimeoutMillis: config.db.idleTimeoutMillis
}

const pool = new pg.Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err:Error, client:pg.Client) {
    logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

/* 
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlToDB = (sql:string, data:string[][], callback:Function) => {
    logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);
    pool.query(sql, data, (err: Error, result:pg.QueryResult) => {
        if (err) {
            logger.error(`sqlToDB() pool.query error: ${err}`);
            callback(err);
        } else {
            logger.debug(`sqlToDB(): ${result.command} | ${result.rowCount}`);
            callback(null, result.rows);
        }
    });
}

/*
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
export const getTransaction = (callback:Function) => {
    logger.debug(`getTransaction()`);
    pool.connect((err:Error, client:pg.Client, done:any) => {
        logger.debug(`getTransaction() | pool.connect()`);
        if (err) {
            logger.error(`getTransaction() failed: ${err}`);
            callback(err);
        } else {
            client.query('BEGIN', (err) => {
                if (err) {
                    done();
                    callback(err);
                } else {
                    callback(null, client, done);
                }
            });
        }
    });
}

/* 
 * Execute a sql statment with a single row of data
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecSingleRow = (client:pg.Client, sql:string, data:string[][], callback:Function) => {
    logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);

    client.query(sql, data, (err, result) => {
        if (err) {
            logger.debug(`sqlExecSingleRow() error: ${err} | sql: ${sql} | data: ${data}`);
            callback(err);
        } else {
            logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
            callback(null, result);
        }
    });
}

/*
 * Execute a sql statement with multiple rows of parameter data.
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecMultipleRows = (client:pg.Client, sql:string, data:string[][], callback:Function) => {
    logger.debug(`inside sqlExecMultipleRows()`);
    var recordCount = 0;
    //connect to Postgres
    if (data.length !== 0) {
        //use asyncSeries so each item in loop needs callback to progress
        async.eachSeries(data, (item, itemCallback) => {
            logger.debug(`sqlExecMultipleRows() eachSeries data: ${data}`);
            logger.debug(`sqlExecMultipleRows() eachSeries item: ${item}`);
            //try to insert/update/delete record
            client.query(sql, item, (err:Error, result:pg.QueryResult) => {
                logger.debug(`sqlExecMultipleRows() client.query() sql: ${sql} | item: ${item}`);
                //if no error - continue
                if (err) {
                    logger.debug(`sqlExecMultipleRows() error: ${err} | sql: ${sql} | item: ${item}`);
                    callback(err);
                } else {
                    recordCount++;
                    //if final item, close connection and send callback
                    if (recordCount === data.length) {
                        result.rowCount = recordCount
                        callback(null, result);
                    } else {
                        //callback for asyncSeries to continue looping if not last item
                        itemCallback();
                    }
                }
            });
        });        
    } else {
        logger.error(`sqlExecMultipleRows(): No data available`)
        callback('No data available');
    }
}

/*
 * Rollback transaction
 */
export const rollback = (client:pg.Client, done:any) => {
    if (typeof client !== 'undefined' && client) {
        logger.info(`sql transaction rollback`);
        client.query('ROLLBACK', done);
    } else {
        logger.warn(`rollback() not excuted. client is not set`);
    }
}

/*
 * Commit transaction
 */
export const commit = (client:pg.Client, done:any) => {
    logger.debug(`sql transaction committed`);
    client.query('COMMIT', done);
}
