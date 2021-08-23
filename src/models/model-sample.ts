import { PoolClient, QueryResult } from 'pg';
import * as dbUtil from './../utils/dbUtil';
import { logger } from './../utils/logger';
const transactionSuccess = 'transaction success';

/*
 * sample query
 * @return server time
 */
export const getTimeModel = async (): Promise<QueryResult> => {
    const sql = 'SELECT NOW() as now;';
    const data: string[][] = [];
    let result: QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

/*
 * sample query using transactions
 * @return transaction success
 */
export const sampleTransactionModel = async (): Promise<string> => {
    const singleSql = 'DELETE FROM TEST;';
    // use parametized queries to prevent SQL injection attacks
    const multiSql = 'INSERT INTO TEST (testcolumn) VALUES ($1);';
    const singleData: string[][] = [];
    const multiData: string[][] = [['typescript'], ['is'], ['fun']];
    const client: PoolClient = await dbUtil.getTransaction();
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
};
