import { Request, Response } from 'express';
import logger = require('./../utils/logger');
import * as sampleModel from './../models/model-sample';
import { QueryResult } from 'pg';

// sample controller
export const getTime = async (req: Request, res: Response) => {
    let result : QueryResult;
    try {
        result = await sampleModel.getTimeModel();
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getTime error: ${error.message}`);
        res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}

// sample controller using transaction
export const sampleTransaction = async (req: Request, res: Response) => {
    let result : String;
    try {
        result = await sampleModel.sampleTransactionModel();
        res.status(200).json({status:'ok', message: result, statusCode: 200});
    } catch (error) {
        logger.error(`sampleTransaction error: ${error.message}`);
        res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}
