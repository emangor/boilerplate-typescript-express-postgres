import {Client, QueryResult} from 'pg';
import * as dbUtil from './../utils/dbUtil';
import logger = require('./../utils/logger');
const transactionSuccess : string = 'transaction success';

/* 
 * sample query
 * @return server time
 */
export const getTimeModel = async () => {
    let sql = "SELECT NOW();";
    let data : string[][] = [];
    let result : QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

/* 
 * sample query using transactions
 * @return transaction success
 */
export const sampleTransactionModel = async () => {
    let singleSql = "DELETE FROM TEST";
    let multiSql = "INSERT INTO TEST (testcolumn) VALUES ($1)";
    let singleData : string[][] = [];
    let multiData : string[][] = [['typescript'], ['is'], ['fun']];
    let client: Client = await dbUtil.getTransaction();
    try {
        await dbUtil.sqlExecSingleRow(client, singleSql, singleData);
        await dbUtil.sqlExecMultipleRows(client, multiSql, multiData);
        await dbUtil.commit(client);
        return transactionSuccess;
    } catch (error) {
        await dbUtil.rollback(client);
        logger.error(`sampleTransactionModel error: ${error.message}`);
        throw new Error(error.message);
    }
}
