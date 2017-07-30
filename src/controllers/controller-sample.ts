import logger = require('./../utils/logger');
import * as sampleModel from './../models/model-sample';

// sample controller
export let getTime = (req, res) => {
    sampleModel.getTimeModel(function(err, response){
        if(err){
            logger.error(`getTime error: ${err}`);
            res.status(500).json({status:'error', message:err, statusCode: 500});
        } else {
            res.status(200).json(response);
        }
    });
}

// sample controller using transaction
export let sampleTransaction = (req, res) => {
    sampleModel.sampleTransactionModel(function(err, response){
        if(err){
            logger.error(`sampleTransaction error: ${err}`);
            res.status(500).json({status:'error', message:err, statusCode: 500});
        } else {
            res.status(200).json({status:'ok', message:response, statusCode: 200});
        }
    });
}
