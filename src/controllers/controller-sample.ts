import { Request, Response } from 'express';
import logger = require('./../utils/logger');
import * as sampleModel from './../models/model-sample';

// sample controller
export const getTime = (req: Request, res: Response) => {
    sampleModel.getTimeModel((err:Error, response:Object) => {
        if(err){
            logger.error(`getTime error: ${err}`);
            res.status(500).json({status:'error', message:err, statusCode: 500});
        } else {
            res.status(200).json(response);
        }
    });
}

// sample controller using transaction
export const sampleTransaction = (req: Request, res: Response) => {
    sampleModel.sampleTransactionModel((err:Error, response:string) => {
        if(err){
            logger.error(`sampleTransaction error: ${err}`);
            res.status(500).json({status:'error', message:err, statusCode: 500});
        } else {
            res.status(200).json({status:'ok', message:response, statusCode: 200});
        }
    });
}
