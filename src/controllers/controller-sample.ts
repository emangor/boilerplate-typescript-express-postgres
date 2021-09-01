import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { getTimeModel, sampleTransactionModel } from './../models/model-sample';
import { QueryResult } from 'pg';

/**
 * sample controller
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getTime = async (req: Request, res: Response): Promise<void> => {
    let result: QueryResult;
    try {
        result = await getTimeModel();
        res.status(200).json({
            status: 'ok',
            message: result.rows,
            statusCode: 200,
        });
    } catch (error) {
        logger.error(`getTime error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};

/**
 * sample controller using transaction
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const sampleTransaction = async (
    req: Request,
    res: Response
): Promise<void> => {
    let result: string;
    try {
        result = await sampleTransactionModel();
        res.status(200).json({
            status: 'ok',
            message: result,
            statusCode: 200,
        });
    } catch (error) {
        logger.error(`sampleTransaction error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};
